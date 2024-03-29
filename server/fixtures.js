import { Meteor } from 'meteor/meteor';
import { times } from 'lodash';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Registration } from '/api/registrations';
import { Image } from '../api/images';
import { Event } from '/api/events';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    // Create organiser
    const organiserId = Accounts.createUser({
      email: 'test+support@rsvp.test',
      password: 'Passw0rd',
      profile: {
        firstName: 'Support',
        lastName: 'Admin',
      },
    });
    // Create events
    const events = times(3, (index) => {
      const imageId = Random.id();
      Image.load('https://placehold.co/640x360/event.png', { fileId: imageId });
      const event = new Event({
        'name': 'AI conference',
        'organiserId': organiserId,
        'startsAt': moment().add(1, 'hour').toDate(),
        'description': `International AI conference ${index}`,
        'imageId': imageId,
        'depositAmount': 10,
      });
      event.save();
      return event;
    });
    // Create Attendee users
    [
      ['Ada', 'Lovelace'],
      ['Alan', 'Turing'],
      ['Sam', 'Smith'],
    ].forEach(([firstName, lastName], index) => {
      const attendeeId = Accounts.createUser({
        username: `User${index}`,
        password: 'Passw0rd',
        profile: {
          firstName: firstName,
          lastName: lastName,
        },
      });
      // Register attendee users
      const registration = new Registration({
        'attendeeId': attendeeId,
        'eventId': events[index]._id,
        'comment': `Comment from ${firstName} ${lastName}`,
      });
      registration.save();
    });
  }
});
