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

const UserEmail = Class.create({
  name: 'UserEmail',
  fields: {
    'address': String,
    'verified': Boolean,
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

export const Organiser = User.inherit({
  name: 'Organiser',
  fields: {
    'emails': [UserEmail],
  },
});

export const Attendee = User.inherit({
  name: 'Attendee',
});
