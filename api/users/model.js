import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

const Profile = Class.create({
  name: 'UserProfile',
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
  name: 'TelegramUserService',
  /* No collection attribute */
  fields: {
    'id': String,
    'username': String,
    'createdAt': Date,
  },
});

const Services = Class.create({
  name: 'UserServices',
  /* No collection attribute */
  fields: {
    telegram: {
      type: TelegramService,
      optional: true,
    },
  },
  helpers: {
    name() {
      return `${this.profile.firstName} ${this.profile.lastName}`;
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
