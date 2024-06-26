import { TemplateController } from 'meteor/space:template-controller';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Event } from '/api/events';
import { eventSchema } from './schema';
import './create.html';

TemplateController('Organiser_event_create', {
  helpers: {
    schema() {
      return eventSchema;
    },
  },
});

AutoForm.addHooks('submitCreate', {
  onSubmit(data) {
    this.event.preventDefault();
    const event = new Event(data);
    event.save(this.done);
    return false;
  },
  onSuccess() {
    FlowRouter.go('Events.browse');
  },
});
