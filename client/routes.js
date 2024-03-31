import { Meteor } from 'meteor/meteor';
import { WebApp } from 'miku-web-app';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import './ui/layout';
import './ui/pages/home';
import './ui/pages/calendar';
import './ui/pages/events';
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

/**
 * @see https://github.com/meteor-compat/useraccounts-flow-routing-extra/?tab=readme-ov-file#routes
 */
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

// FlowRouter.route('/', {
//   name: 'home',
//   action() {
//     this.render('Layout', { main: 'Home' });
//   },
// });

FlowRouter.route('/', {
  name: 'Calendar',
  action() {
    this.render('Layout', { main: 'Calendar' });
  },
});

FlowRouter.route('/events/:date', {
  name: 'Events',
  action() {
    this.render('Layout', { main: 'Events' });
  },
});

FlowRouter.route('/organiser/events', {
  name: 'Events.browse',
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
  name: 'Registrations.browse',
  action() {
    this.render('Layout', { main: 'Organiser_registrations' });
  },
});
