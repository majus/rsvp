export { Attendee, Organiser } from './model';

if (Meteor.isServer) {
  import './server/accounts';
  import './server/publications';
}
