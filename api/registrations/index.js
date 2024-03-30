import { Meteor } from 'meteor/meteor';
export { Registration } from './model';

if (Meteor.isServer) {
  import './server/cron';
  import './server/refunds';
}
