import { Meteor } from 'meteor/meteor';

if (Meteor.isClient) {
  export { Telegram } from './client/telegram';
}
