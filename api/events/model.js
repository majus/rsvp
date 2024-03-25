import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Registration } from '../registrations/model';
import { Organiser } from '../users';
import { Image } from '../images';

export const Event = Class.create({
  name: 'Events',
  collection: new Mongo.Collection('events'),
  fields: {
    'name': String,
    'organiserId': String,
    'startsAt': Date,
    'description': String,
    'imageId': String,
    'depositAmount': Number,
  },
  helpers: {
    registrations() {
      return Registration.find({ 'eventId': this._id }).fetch();
    },
    organiser() {
      return Organiser.findOne(this.organiserId);
    },
    image() {
      return Image.findOne(this.imageId);
    },
    isStarted() {
      return this.startsAt < new Date();
    },
    formatDeposit() {
      return `${this.depositAmount} ${Meteor.settings.public.tick.toUpperCase()}`;
    },
  },
  secured: false,
});
