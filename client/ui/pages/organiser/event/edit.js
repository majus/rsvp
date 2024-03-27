import { TemplateController } from 'meteor/space:template-controller';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Event } from '/api/events';
import { eventSchema } from './schema';
import './edit.html';

TemplateController('Organiser_event_edit', {
  helpers: {
    schema() {
      return eventSchema;
    },
    event() {
      const eventId = FlowRouter.getParam('_id');
      return Event.findOne(eventId);
    },
  },
});

AutoForm.addHooks('submitUpdate', {
  onSubmit(data) {
    this.event.preventDefault();
    Event.update({
      _id: FlowRouter.getParam('_id'),
    }, {
      $set: {
        ...data,
      },
    });
    FlowRouter.go('/organiser/events');
  },
});
