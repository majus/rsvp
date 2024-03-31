/* eslint-disable no-underscore-dangle */
import crypto from 'crypto';
import assert from 'assert';
import qs from 'query-string';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { Attendee } from '/api/users';

const { botToken } = Meteor.settings;

/**
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function validateInitData(initData) {
  const parts = decodeURIComponent(initData)
    .split('&')
    .filter((part) => !part.startsWith('hash='));
  parts.sort();
  const dataString = parts.join('\n');
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  assert.equal(
    qs.parse(initData).hash,
    crypto.createHmac('sha256', secret).update(dataString).digest('hex'),
  );
  return true;
}

function extractUserData(options) {
  const { user } = qs.parse(options.initData);
  return JSON.parse(user);
}

function resumeToken(userId) {
  const stamped = Accounts._generateStampedLoginToken();
  const hash = Accounts._hashStampedToken(stamped);
  Meteor.users.update(userId, {
    $push: { 'services.resume.loginTokens': hash },
  });
  return stamped.token;
}

Accounts.registerLoginHandler('telegram', (options) => {
  /**
   * @see https://core.telegram.org/bots/webapps#webappinitdata
   */
  check(options, { initData: Match.Where(validateInitData) });
  const data = extractUserData(options);
  const user = Meteor.users.findOne(
    { 'services.telegram.id': data.id },
    { fields: { 'services': 1 } },
  );
  if (user) {
    return {
      userId: user._id,
      token: resumeToken(user._id),
    };
  }
  // Register a new user
  const attendee = new Attendee({
    'profile': {
      'firstName': data.first_name,
      'lastName': data.last_name,
      'telegram': data.username,
    },
    'services': {
      'telegram': {
        'id': data.id,
        'username': data.username,
        'createdAt': new Date(),
      },
    },
  });
  attendee.save();
  return { userId: attendee._id, token: resumeToken(attendee._id) };
});
