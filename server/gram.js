import { Meteor } from 'meteor/meteor';
import { getBalanceByTick } from 'gram20-sdk/v1/lib/get-balance';
import { /* getTokenInfo, */ getHistoryByTick } from 'gram20-sdk/v1';

const { wallet, tick } = Meteor.settings.public;

// Get all gram20 tokens balances
Meteor.startup(async () => {
  try {
    const { balance } = await getBalanceByTick(wallet, tick);
    console.log(`Connected: ${wallet} (${balance} ${tick.toUpperCase()})`);
  } catch (err) {
    console.error(err.message, err.stack);
  }
});

// Get gram20 token info by tick
Meteor.startup(async () => {
  /**
   * {
   *  tick: 'gram',
   *  holders: 38328,
   *  total_supply: 210000000000,
   *  supply: 210000000000,
   *  mintable: false,
   *  mint_limit: 10000,
   *  address: 'EQCzYd9cZUzcXA7OSGeDNc5iPgokIWboUJ6u7xEdDFK5tGd4',
   *  deploy_time: 1703250013,
   *  deploy_hash: 'PhIU1w8woHrYda7AvWbXHwGr4CR6Jhbh9D3NPhneTY8=',
   *  owner: 'EQBfd-MQFOFA9ZHOQHsB2ZbTV1Gi0F1T8w0uVZN3YLEvzKa-',
   *  verified: true,
   *  royalty_address: 'EQBAeW5Kypzgt4WcgJZV8JLIhGUFYmHJfoKrJlBKHde74ps4',
   *  protocol_fee: 40000000,
   *  title: null,
   *  description: null,
   *  url: null,
   *  image: null,
   *  image_url: null,
   *  tags: [ 'verified', 'mostused', 'mostholders', 'mosttraded' ]
   * }
   */
  // const info = await getTokenInfo(tick);
  // console.info(`${tick.toUpperCase()} info:`, info);
});

// Retrieve historical gram20 token transactions
Meteor.startup(async () => {
  /**
   * type HistoryInfo = {
   *  address: string;
   *  tick: string;
   *  time: number;
   *  hash: string;
   *  delta: number;
   *  comment: string;
   *  peer: string;
   *  lt: number;
   * }
   */
  try {
    const history = await getHistoryByTick(wallet, tick);
    for (const { delta, tick, time, comment } of history) {
      console.log(
        [
          new Date(time).toISOString(),
          '| Transfer of',
          delta > 0 ? `+${delta}` : delta,
          `${tick.toUpperCase()}:`,
          `"${comment}"`,
        ].join(' '),
      );
    }
  } catch (err) {
    console.error(err.message, err.stack);
  }
});
