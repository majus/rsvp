import { Class } from 'meteor/jagi:astronomy';
import { User } from '../model';
import { Event } from '../../events';

const UserEmail = Class.create({
  name: 'UserEmail',
  fields: {
    'address': String,
    'verified': Boolean,
  },
});

export const Organiser = User.inherit({
  name: 'Organiser',
  fields: {
    'emails': [UserEmail],
  },
  helpers: {
    events() {
      return Event.find({ 'organiserId': this._id }).fetch();
    },
  },
});
