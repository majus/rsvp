import { Meteor } from 'meteor/meteor';
import { WebApp } from 'miku-web-app';
import { TemplateController } from 'meteor/space:template-controller';
import './home.html';

TemplateController('Home', {
  state: {},
  onCreated() {},
  onRendered() {},
  helpers: {},
  events: {
    'click [data-action=openLink]'() {
      WebApp.openLink('https://ya.ru', {
        try_instant_view: true,
      });
    },
    'click [data-action=requestTransfer]'() {
      const { wallet, tick } = Meteor.settings.public;
      const data = {
        type: 'transfer',
        to: wallet,
        amount: 100,
        tick,
        memo: '1234',
      };
      const encodedData = encodeURIComponent(JSON.stringify(data))
        .replace(/%/g, '--')
        .replace(/=/g, '__')
        .replace(/&/g, '-');
      WebApp.openTelegramLink(`https://t.me/tg20/app?startapp=${encodedData}`);
    },
    'click [data-action=closeApp]'() {
      WebApp.close();
    },
  },
  private: {},
});
