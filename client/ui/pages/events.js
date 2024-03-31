import { WebApp } from 'miku-web-app';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { showError } from 'meteor/imajus:bootstrap-helpers';
import { Event } from '/api/events';
import { Registration } from '/api/registrations';
import './events.html';

TemplateController('Events', {
  helpers: {
    date() {
      return this.date();
    },
    events() {
      const date = this.date();
      return Event.find(
        {
          'startsAt': {
            $gte: moment(date).startOf('day').toDate(),
            $lt: moment(date).endOf('day').toDate(),
          },
        },
        {
          sort: { 'startsAt': 1 },
        },
      );
    },
    excerpt(string) {
      if (string.length > 200) {
        return `${string.substring(0, 200)}…`;
      }
      return string;
    },
  },
  events: {
    async 'click [data-action=rsvp]'(e) {
      const { wallet, tick } = Meteor.settings.public;
      const event = Event.findOne(e.currentTarget.dataset.id);
      try {
        // Create Event registration
        const registration = new Registration({
          'eventId': event._id,
        });
        registration.save();
        // Process Telegram payment
        const data = {
          type: 'transfer',
          to: wallet,
          amount: event.depositAmount,
          tick,
          memo: registration._id,
        };
        const payload = encodeURIComponent(JSON.stringify(data))
          .replace(/%/g, '--')
          .replace(/=/g, '__')
          .replace(/&/g, '-');
        WebApp.openTelegramLink(`https://t.me/tg20/app?startapp=${payload}`);
      } catch (err) {
        showError(err);
      }
    },
  },
  private: {
    date() {
      const date = FlowRouter.getParam('date');
      return new Date(date);
    },
  },
});
