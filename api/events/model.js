import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import moment from 'moment';
import { Organiser } from '../users';
import { Images } from '../images';

export const Event = Class.create({
  name: 'Events',
  collection: new Mongo.Collection('events'),
  fields: {
    'name': String,
    'organiserId': String,
    'startsAt': Date,
    'description': String,
    'imageId': String,
    'depositAmount': {
      type: Number,
      validators: [{ type: 'number' }],
    },
  },
  helpers: {
    organiser() {
      return Organiser.findOne(this.organiserId);
    },
    image() {
      return Images.findOne(this.imageId);
    },
    isStarted() {
      return this.startsAt < new Date();
    },
    formatDeposit() {
      return `${
        this.depositAmount
      } ${Meteor.settings.public.tick.toUpperCase()}`;
    },
    formatDate() {
      return moment(this.startsAt).format('MMM Do YY, h:mm a');
    },
  },
  events: {
    beforeInsert(e) {
      const event = e.currentTarget;
      if (!e.trusted) {
        event.organiserId = Meteor.userId();
      }
    },
  },
  secured: false,
});

Organiser.extend({
  helpers: {
    events() {
      return Event.find({ 'organiserId': this._id }).fetch();
    },
  },
});
