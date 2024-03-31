import { Meteor } from 'meteor/meteor';
import { WebApp } from 'miku-web-app';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { showError } from 'meteor/imajus:bootstrap-helpers';
import { Event } from '/api/events';
import { Registration } from '/api/registrations';
import './detail.html';

TemplateController('Event_detail', {
  helpers: {
    event() {
      const eventId = FlowRouter.getParam('_id');
      return Event.findOne(eventId);
    },
    rsvped() {
      return this.rsvped();
    },
    registration() {
      return this.registration();
    },
    attendanceStatus() {
      return this.registration().isConfirmed() ? 'Attended' : 'Waiting for attendance';
    },
    refundingStatus() {
      if (this.registration().isDeposited()) {
        if (this.registration().isRefunded()) {
          return 'Refunded!';
        }
        if (this.registration().confirmed) {
          return 'Waiting for refund...';
        } else {
          return 'There is no refund due to your absence.';
        }
      }
      return 'Somthing went wrong';
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
      this.state.date = new Date(date);
    },
    rsvped() {
      return this.registration();
    },
    registration() {
      const eventId = FlowRouter.getParam('_id');
      return Registration.findOne({
        'eventId': eventId,
        'attendeeId': Meteor.userId(),
      });
    },
  },
});
