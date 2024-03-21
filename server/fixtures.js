import { Meteor } from 'meteor/meteor';
import { Organiser, Attendee } from '/api/users';
import { Registration } from '/api/registrations';
import { Event } from '/api/events';

Meteor.startup(() => {
  if (Organiser.find().count() === 0) {
    // Create initial Organiser user
    const organiser = new Organiser({
      'email': 'test+support@rsvp.test',
      'password': 'Passw0rd',
      'profile': {
        'firstName': 'Support',
        'lastName': 'Admin',
      },
    });
    organiser.save();
    // Create event
    const event = new Event({
      'name': 'AI conference',
      'organiserId': organiser._id,
      'startsAt': new Date(),
      'description': 'Internatioanal AI conference',
      'imageId': 'XXXImageIdXXX',
      'wallet': 'walletAddress',
      'deposit': 0,
    });
    event.save();
    if (Attendee.find().count() === 0) {
      // Create Attendee users
      const attendees = [
        ['Ada', 'Lovelace'],
        ['Alan', 'Turing'],
        ['Sam', 'Smith'],
      ].map(([firstName, lastName], index) => {
        const attendee = new Attendee({
          'wellet': `walletAddress${index}`,
          'authorisation': `authKey${index}`,
          'profile': {
            'firstName': firstName,
            'lastName': lastName,
          },
        });
        attendee.save();
        return attendee;
      });
      // Register attendee users
      attendees.forEach((attendee) => {
        const registration = new Registration({
          'attendeeId': attendee._id,
          'eventId': event._id,
        });
        registration.save();
      });
    }
  }
});
