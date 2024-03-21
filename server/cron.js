import { SyncedCron } from 'meteor/littledata:synced-cron';

SyncedCron.config({
  collectionName: 'cron',
  collectionTTL: 60,
});

SyncedCron.start();
