import moment from 'moment';
import 'bootstrap-datepicker';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Event } from '/api/events';
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
  },
  events: {
    'changeDate'(e) {
      FlowRouter.go('Events', { date: e.date.toISOString().substr(0, 10) });
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
