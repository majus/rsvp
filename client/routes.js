import { Meteor } from 'meteor/meteor';
import { WebApp } from 'miku-web-app';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './ui/layout';
import './ui/home';
import './ui/pages/organiser/event/browse';
import './ui/pages/organiser/event/edit';
import './ui/pages/organiser/event/create';
import './ui/pages/organiser/registration/browse';

//TODO: Alternative: redirect to some route, which is "Default"
// FlowRouter.route('/',
//   triggersEnter: [(context, redirect) => redirect('xxx')],
// });

FlowRouter.wait();
Meteor.startup(async () => {
  await WebApp.ready();
  FlowRouter.initialize();
});

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});

FlowRouter.route('/organiser/events', {
  name: 'Events.list',
  action() {
    this.render('Layout', { main: 'Organiser_events' });
  },
});

FlowRouter.route('/organiser/events/edit/:_id', {
  name: 'Events.edit',
  action() {
    this.render('Layout', { main: 'Organiser_event_edit' });
  },
});

FlowRouter.route('/organiser/events/create', {
  name: 'Events.create',
  action() {
    this.render('Layout', { main: 'Organiser_event_create' });
  },
});

FlowRouter.route('/organiser/registrations', {
  name: 'Registrations.create',
  action() {
    this.render('Layout', { main: 'Organiser_registrations' });
  },
});
