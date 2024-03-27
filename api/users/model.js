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

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,
  typeField: 'role',
  fields: {
    'profile': Profile,
    'services': Object,
  },
  helpers: {
    name() {
      return `${this.profile.firstName} ${this.profile.lastName}`;
    },
  },
  secured: false,
});
