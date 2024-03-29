import moment from 'moment';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Event } from '/api/events';
import './events.html';

TemplateController('Events', {
  helpers: {
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
  },
  events: {
    'rsvp'(e) {
      const event = Event.findOne(e.currentTarget.dataset.id);
      //TODO: Process Telegram payment
      //TODO: Create Event registration
    },
  },
  private: {
    date() {
      const date = FlowRouter.getParam('date');
      this.state.date = new Date(date);
    },
  },
});
