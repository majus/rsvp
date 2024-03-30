import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { Event } from '/api/events';
import './browse.html';

TemplateController('Organiser_events', {
  helpers: {
    events() {
      return Event.find(
        { 'organiserId': Meteor.userId() },
        { sort: { 'createdAt': -1 } },
      ).fetch();
    },
  },
  events: {
    'click [data-action=delete]'(e) {
      Event.remove(e.currentTarget.dataset.id);
    },
  },
});
