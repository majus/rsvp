import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { isBoolean } from 'lodash';
import { Event } from '../events';
import { Attendee } from '../users';

export const Registration = Class.create({
  name: 'Registration',
  collection: new Mongo.Collection('registrations'),
  fields: {
    'attendeeId': String,
    'eventId': String,
    'comment': {
      type: String,
      optional: true,
    },
    'confirmed': {
      type: Boolean,
      optional: true,
    },
    'depositAmount': Number,
    'depositAddress': {
      type: String,
      optional: true,
    },
    'depositHash': {
      type: String,
      optional: true,
    },
    'refundedAt': {
      type: Date,
      optional: true,
    },
    'refundHash': {
      type: String,
      optional: true,
    },
  },
  helpers: {
    event() {
      return Event.findOne(this.eventId);
    },
    attendee() {
      return Attendee.findOne(this.attendeeId);
    },
    isConfirmed() {
      return Boolean(this.confirmed);
    },
    isCompleted() {
      return isBoolean(this.confirmed);
    },
    isRefunded() {
      return Boolean(this.refundHash);
    },
    isDeposited() {
      return Boolean(this.depositHash);
    },
    formatDeposit() {
      return `${
        this.depositAmount
      } ${Meteor.settings.public.tick.toUpperCase()}`;
    },
  },
  events: {
    beforeInsert(e) {
      const registration = e.currentTarget;
      const event = registration.event();
      registration.depositAmount = event.depositAmount;
      if (!e.trusted) {
        registration.attendeeId = Meteor.userId();
      }
    },
  },
  behaviors: {
    timestamp: {
      hasCreatedField: true,
      createdFieldName: 'createdAt',
      hasUpdatedField: false,
    },
  },
  secured: false,
});

Attendee.extend({
  helpers: {
    registrations() {
      return Registration.find({ 'attendeeId': this._id }).fetch();
    },
  },
});

Event.extend({
  helpers: {
    registrations() {
      return Registration.find({ 'eventId': this._id }).fetch();
    },
  },
});
