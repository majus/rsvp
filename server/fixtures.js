import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import moment from 'moment';
import { Organiser, Attendee } from '/api/users';
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
      'wallet': 'walletAddress',
      'depositAmount': 0,
    });
    event.save();
    // Create Attendee users
    const attendeeIds = [
      ['Ada', 'Lovelace'],
      ['Alan', 'Turing'],
      ['Sam', 'Smith'],
    ].map(([firstName, lastName], index) => {
      const attendeeId = Accounts.createUser({
        username: `User${index}`,
        password: 'Passw0rd',
        profile: {
          firstName: firstName,
          lastName: lastName,
        },
      });
      return attendeeId;
    });
    // Register attendee users
    const attendees = Meteor.users.find({ _id: { $in: attendeeIds } }).fetch();
    attendees.forEach((attendee) => {
      const registration = new Registration({
        'attendeeId': attendee._id,
        'eventId': event._id,
        'comment': `Comment from ${attendee.profile.firstName} ${attendee.profile.lastName}`,
        'depositAmount': 0,
        'createdAt': new Date(),
      });
      registration.save();
    });
  }
});
