import { getHistoryByTick } from 'gram20-sdk/v1';
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { Registration } from '../model';
import { transferToken } from '/api/telegram';

const { wallet, tick } = Meteor.settings.public;

SyncedCron.add({
  name: 'Settle pending txs',
  schedule: (parser) => parser.text('every 5 minutes'),
  async job() {
    const history = await getHistoryByTick(wallet, tick);
    for (const { peer, delta, hash, comment } of history) {
      if (comment) {
        // Handle deposit
        if (delta > 0) {
          const registration = Registration.findOne({
            '_id': comment,
            'depositHash': null,
          });
          if (registration) {
            //TODO: Check if the amount received matched the requested amount
            registration.depositAddress = peer;
            registration.depositHash = hash;
            registration.save();
          }
        } else if (delta < 0) {
          const registration = Registration.findOne({
            '_id': comment,
            'refundHash': null,
          });
          if (registration) {
            // Handle refund
            registration.refundHash = hash;
            registration.save();
          }
        }
      }
    }
  },
});

SyncedCron.add({
  name: 'Initiate refunds',
  schedule: (parser) => parser.text('every 5 minutes'),
  async job() {
    const registrations = Registration.find({
      'confirmed': true,
      'refundHash': null,
    });
    for await (const registration of registrations) {
      try {
        // Process refund
        await transferToken(
          registration.depositAddress,
          registration.depositAmount,
          registration._id,
        );
        registration.refundedAt = new Date();
        registration.save();
      } catch (err) {
        console.error(err);
      }
    }
  },
});
