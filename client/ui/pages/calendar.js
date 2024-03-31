import moment from 'moment';
import 'bootstrap-datepicker';
import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Event } from '/api/events';
import { Registration } from '/api/registrations';
import './calendar.html';

TemplateController('Calendar', {
  state: {
    date: null,
  },
  onRendered() {
    this.calendar = this.$('[data-role=calendar]')
      .datepicker({
        format: 'yyyy-mm-dd',
        startDate: new Date(), // today
        todayHighlight: true,
        // todayBtn: 'linked',
        beforeShowDay: (date) => {
          const events = this.eventsForDate(date);
          return events.count() > 0;
        },
      })
      .data('datepicker');
    // this.calendar.setDate(new Date());
    this.autorun((comp) => {
      // Reactive dependency
      Event.find().count();
      if (!comp.firstRun) {
        this.calendar.fill();
      }
    });
  },
  helpers: {
    rsvps() {
      return Registration.find(
        { 'attendeeId': Meteor.userId() },
        { sort: { 'createdAt': -1 } },
      );
    },
  },
  events: {
    'changeDate'(e) {
      FlowRouter.go('Events', { date: moment(e.date).format('YYYY-MM-DD') });
    },
  },
  private: {
    eventsForDate(date) {
      return Event.find(
        {
          'startsAt': {
            $gte: moment(date).startOf('day').toDate(),
            $lt: moment(date).endOf('day').toDate(),
          },
        },
        {
          sort: { 'startsAt': 1 },
        },
      );
    },
  },
});
