/* eslint-disable no-param-reassign */
import { Accounts } from 'meteor/accounts-base';
import { Attendee, Organiser } from '../model';

Accounts.onCreateUser((options, user) => {
  if (user.services && 'telegram' in user.services) {
    user.role = Attendee.getName();
  } else {
    user.role = Organiser.getName();
  }
  return user;
});
