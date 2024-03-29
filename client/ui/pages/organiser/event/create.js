import { Meteor } from 'meteor/meteor';
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
    const event = new Event({
      organiserId: Meteor.userId(),
      ...data,
    });
    event.save();
    FlowRouter.go('Events.list');
  },
});
