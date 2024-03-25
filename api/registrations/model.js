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
    'depostiAddress': {
      type: String,
      optional: true,
    },
    'depostitHash': {
      type: String,
      optional: true,
    },
    'refundHash': {
      type: String,
      optional: true,
    },
    'createdAt': Date,
  },
  helpers: {
    event() {
      return Event.findOne(this.eventId);
    },
    attendee() {
      return Attendee.findOne(this.attendeeId);
    },
    isConfirmed() {
      return isBoolean(this.confirmed);
    },
    isRefunded () {
      return Boolean(this.refundHash);
    },
    isDeposited () {
      return Boolean(this.depostitHash);
    },
  },
  secured: false,
});
