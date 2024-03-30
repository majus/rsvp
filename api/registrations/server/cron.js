import { getHistoryByTick } from 'gram20-sdk/v1';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { Registration } from '../model';

const { wallet, tick } = Meteor.settings.public;

SyncedCron.add({
  name: 'Settle pending RSVPs',
  schedule: (parser) => parser.text('every 5 minutes'),
  async job() {
    const history = await getHistoryByTick(wallet, tick);
    for (const { address, hash, comment } of history) {
      if (comment) {
        const registration = Registration.findOne({
          '_id': comment,
          'depositHash': null,
        });
        if (registration) {
          //TODO: Check if the amount received matched the requested amount
          registration.depositAddress = address;
          registration.depositHash = hash;
          registration.save();
        }
      }
    }
  },
});
