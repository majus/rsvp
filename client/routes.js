import { Meteor } from 'meteor/meteor';
import { WebApp } from 'miku-web-app';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import './ui/layout';
import './ui/home';

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

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});
