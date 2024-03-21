import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Registration } from '../registrations/model';
import { Organiser } from '../users';

export const Event = Class.create({
  name: 'Events',
  collection: new Mongo.Collection('events'),
  fields: {
    'name': String,
    'organiserId': String,
    'startsAt': Date,
    'description': String,
    'imageId': String,
    'wallet': String,
    'deposit': Number,
  },
  helpers: {
    registrations() {
      return Registration.find({ 'eventId': this._id }).fetch();
    },
    organiser() {
      return Organiser.findOne(this.organiserId);
    },
  },
  secured: false,
});
