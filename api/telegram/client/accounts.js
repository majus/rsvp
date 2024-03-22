import { WebApp } from 'miku-web-app';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
// import { showToast } from 'meteor/imajus:bootstrap-helpers';

Meteor.loginWithTelegram = (
  options,
  callback = (err) => {
    if (err) {
      console.error('Login failed', err);
    } else {
      console.info('Logged in with Telegram');
    }
  },
) => {
  Accounts.callLoginMethod({
    methodArguments: [options],
    userCallback: callback,
  });
};

// Automatically login with Telegram
Meteor.startup(() => {
  const { initData } = WebApp;
  if (initData) {
    Meteor.loginWithTelegram({ initData });
  }
});
