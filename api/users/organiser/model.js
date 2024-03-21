import { User } from '../model';
import { Event } from '../../events';

export const Organiser = User.inherit({
  name: 'Organiser',
  fields: {
    'email': String,
    'password': String,
  },
  helpers: {
    events() {
      return Event.find({ 'organiserId': this._id }).fetch();
    },
  },
});
