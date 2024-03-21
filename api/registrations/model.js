import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Event } from '../events';

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
    'depostitHash': {
      type: String,
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
  },
  secured: false,
});
