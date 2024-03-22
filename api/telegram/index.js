import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  import './server/accounts';
  import './server/methods';
}

if (Meteor.isClient) {
  import './client/accounts';
}
