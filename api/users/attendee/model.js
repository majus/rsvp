import { User } from '../model';
import { Registration } from '../../registrations';

export const Attendee = User.inherit({
  name: 'Attendee',
  fields: {
    'wallet': String,
    'authorisation': String,
  },
  helpers: {
    registrations() {
      return Registration.find({ 'attendeeId': this._id }).fetch();
    },
  },
});
