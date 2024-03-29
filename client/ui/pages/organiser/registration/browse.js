import { TemplateController } from 'meteor/space:template-controller';
import { Registration } from '/api/registrations';
import './browse.html';

TemplateController('Organiser_registrations', {
  helpers: {
    registrations() {
      return Registration.find({}, {
        sort: { 'createdAt': 1 },
      }).fetch();
    },
  },
  events: {
    'click [data-action=confirm]'(e) {
      Registration.update(e.currentTarget.dataset.id, {
        $set: {
          confirmed: true,
        },
      });
    },
  },
});
