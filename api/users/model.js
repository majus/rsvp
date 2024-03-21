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

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  fields: {
    'profile': Profile,
  },
  secured: false,
});
