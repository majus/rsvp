import { Meteor } from 'meteor/meteor';
import { times } from 'lodash';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Registration } from '/api/registrations';
import { Image } from '../api/images';
import { Event } from '/api/events';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    times(3, (index) => {
      const organiserId = Accounts.createUser({
        email: `test+support@rsvp.test${index}`,
        password: 'Passw0rd',
        profile: {
          firstName: 'Support',
          lastName: 'Admin',
        },
      });
      // Create event
      const imageId = Random.id();
      Image.load('https://placehold.co/640x360/event.png', { fileId: imageId });
      const event = new Event({
        'name': 'AI conference',
        'organiserId': organiserId,
        'startsAt': moment().add(1, 'hour').toDate(),
        'description': 'Internatioanal AI conference',
        'imageId': imageId,
        'depositAmount': 10,
      });
      event.save();
      // Create Attendee users
      [
        ['Ada', 'Lovelace'],
        ['Alan', 'Turing'],
        ['Sam', 'Smith'],
      ].forEach(([firstName, lastName], i) => {
        const attendeeId = Accounts.createUser({
          username: `User${index}${i}`,
          password: 'Passw0rd',
          profile: {
            firstName: firstName,
            lastName: lastName,
          },
        });
        // Register attendee users
        const registration = new Registration({
          'attendeeId': attendeeId,
          'eventId': event._id,
          'comment': `Comment from ${firstName} ${lastName}`,
        });
        registration.save();
        return attendeeId;
      });
    });
  }
});
