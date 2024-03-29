import { TemplateController } from 'meteor/space:template-controller';
import { Event } from '/api/events';
import './browse.html';

TemplateController('Organiser_events', {
  helpers: {
    events() {
      return Event.find({}, {
        sort: { 'startsAt': 1 },
      }).fetch();
    },
  },
  events: {
    'click [data-action=delete]'(e) {
      Event.remove(e.currentTarget.dataset.id);
    },
  },
});
