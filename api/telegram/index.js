import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  import './server/accounts';
  import './server/methods';
  export * from './server/gram';
}

if (Meteor.isClient) {
  import './client/accounts';
}
