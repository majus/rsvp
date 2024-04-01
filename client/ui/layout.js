import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './layout.html';

TemplateController('Layout', {
  helpers: {
    organiserItems: () => [
      {
        label: 'Events',
        link: FlowRouter.path('Events.browse'),
        active: () =>
          ['Events.browse', 'Events.create', 'Events.edit'].includes(
            FlowRouter.getRouteName(),
          ),
      },
      {
        label: 'RSVPs',
        link: FlowRouter.path('Registrations.browse'),
        active: () => FlowRouter.getRouteName() === 'Registrations.browse',
      },
    ],
    visitorItems: () => [
      {
        label: 'Sign in',
        link: FlowRouter.path('atSignIn'),
        active: () => FlowRouter.getRouteName() === 'atSignIn',
      },
    ],
  },
});
