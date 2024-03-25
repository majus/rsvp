import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

const Profile = Class.create({
  name: 'Profile',
  /* No collection attribute */
  fields: {
    'firstName': String,
    'lastName': String,
    'telegram': {
      type: String,
      optional: true,
    },
  },
});

const TelegramService = Class.create({
  name: 'TelegramService',
  /* No collection attribute */
  fields: {
    'id': String,
    'userName': String,
    'createdAt': Date,
  },
});

const Services = Class.create({
  name: 'Services',
  /* No collection attribute */
  fields: {
    telegram: {
      type: TelegramService,
      optional: true,
    },
  },
});

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  typeField: 'role',
  fields: {
    'profile': Profile,
    'services': Services,
  },
  secured: false,
});
