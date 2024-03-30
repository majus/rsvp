import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import moment from 'moment';
import { Registration } from '/api/registrations';
import { Images } from '/api/images';
import { Event } from '/api/events';
import { Attendee } from '/api/users';

const loadImage = Meteor.wrapAsync(Images.load, Images);

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
    const attendeeIds = [
      ['Ada', 'Lovelace'],
      ['Alan', 'Turing'],
      ['Sam', 'Smith'],
    ].map(([firstName, lastName], index) => {
      const username = `fake-attendee-${index}`;
      const attendeeId = Attendee.insert({
        services: {
          telegram: {
            id: String(100000000 + index),
            username,
          },
        },
        profile: {
          firstName: firstName,
          lastName: lastName,
          telegram: username,
        },
      });
      return attendeeId;
    });
    // Create events
    [
      [
        'Global Tech Innovators Conference',
        "Join us at the annual Global Tech Innovators Conference, where pioneers from around the world gather to showcase cutting-edge technology and discuss the future of innovation. Experience live demos, engaging keynotes, and networking opportunities with industry leaders. Whether you're a startup looking for inspiration or a seasoned professional aiming to stay ahead of the curve, this event is designed to spark creativity and foster collaborations.",
      ],
      [
        'Midnight Masquerade Ball',
        "Step into a night of enchantment at our Midnight Masquerade Ball. Held at the majestic Grandview Manor, this event promises an unforgettable evening of music, dance, and mystery. Guests are invited to don their most extravagant masks and formal attire. Enjoy live performances, gourmet catering, and a secret reveal at midnight. It's not just a party; it's an experience that will mesmerize your senses.",
      ],
      [
        'Urban Gardening Workshop',
        'Discover the joys of urban gardening at our hands-on workshop. Learn how to transform your balconies, windowsills, and small spaces into lush, productive green areas. Our expert gardeners will guide you through the basics of plant care, sustainable growing practices, and creative gardening techniques. This event is perfect for city dwellers looking to add a touch of green to their lives.',
      ],
      [
        'The Great Charity Bake-Off',
        'Whisk, knead, and frost for a cause at The Great Charity Bake-Off. Bakers of all skill levels are welcomed to showcase their talents and compete for the title of Best Community Baker. This heartwarming event combines the love of baking with the spirit of giving, as all proceeds are donated to local food banks. Join us for a day of delicious treats, friendly competition, and community service.',
      ],
      [
        'Future Leaders Youth Summit',
        'Empowering the next generation of leaders, the Future Leaders Youth Summit is a dynamic conference designed for young people aged 14-18. Engage in workshops, inspiring talks, and group activities focused on leadership development, entrepreneurship, and global citizenship. Network with like-minded peers and mentors who are making a difference in the world. This summit is an incredible opportunity for young individuals to find their voice and realize their potential.',
      ],
    ].forEach(([name, description], i) => {
      const image = loadImage('https://loremflickr.com/640/480');
      const event = new Event({
        'name': name,
        'organiserId': organiserId,
        'startsAt': moment()
          .add(10 * i, 'hours')
          .toDate(),
        'description': description,
        'imageId': image._id,
        'depositAmount': 0.001,
      });
      event.save();
      // Register attendee users
      attendeeIds.forEach((attendeeId, j) => {
        const registration = new Registration({
          'attendeeId': attendeeId,
          'eventId': event._id,
          'comment': j % 2 ? `Comment from Attendee ${j}` : undefined,
        });
        registration.save();
      });
    });
  }
});
