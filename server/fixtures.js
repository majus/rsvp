import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Registration } from '/api/registrations';
import { Image } from '../api/images';
import { Event } from '/api/events';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const organiserId = Accounts.createUser({
      email: 'test+support@rsvp.test',
      password: 'Passw0rd',
      profile: {
        firstName: 'Support',
        lastName: 'Admin',
      },
    });
    // Create event
    const imageId = Random.id();
    Image.load('https://placehold.co/640x360', {
      fileName: 'event.png',
      fileId: imageId,
    });
    const event = new Event({
      'name': 'AI conference',
      'organiserId': organiserId,
      'startsAt': moment().add(1, 'hour').toDate(),
      'description': 'Internatioanal AI conference',
      'imageId': imageId,
      'depositAmount': 0,
    });
    event.save();
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
      const attendee = Meteor.users.findOne(attendeeId);
      const registration = new Registration({
        'attendeeId': attendee._id,
        'eventId': event._id,
        'comment': `Comment from ${attendee.profile.firstName} ${attendee.profile.lastName}`,
        'depositAmount': 0,
        'createdAt': new Date(),
      });
      registration.save();
      return attendeeId;
    });
  }
});
