import { Address, beginCell, internal, loadStateInit } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';
import { Meteor } from 'meteor/meteor';

function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function tokenData(client, rootAddress) {
  while (true) {
    try {
      const rootData = await client.runMethod(rootAddress, 'get_root_data', []);
      const tokenData = await client.runMethod(
        rootAddress,
        'get_token_data',
        [],
      );
      rootData.stack.skip(2);
      tokenData.stack.skip(5);
      return {
        tick: rootData.stack.readString(),
        protocolFee: tokenData.stack.readBigNumber(),
      };
    } catch {
      await sleep(300);
    }
  }
}

async function getRecipientData(client, rootAddress, userAddress) {
  while (true) {
    try {
      return await client.runMethod(rootAddress, 'get_user_data', [
        {
          type: 'slice',
          cell: beginCell().storeAddress(userAddress).endCell(),
        },
      ]);
    } catch {
      await sleep(300);
    }
  }
}

async function getUserSCState(client, userContractAddress) {
  while (true) {
    try {
      const { state } = await client.getContractState(userContractAddress);
      return state;
    } catch {
      await sleep(300);
    }
  }
}

function makeTransferPayload(tick, { recipient, value, memo }) {
  if (memo) {
    return `data:application/json,{"p":"gram-20","op":"transfer","tick":"${tick}","amt":"${value}","to":"${recipient.toString(
      { bounceable: true },
    )}","memo":"${memo}"}`;
  } else {
    return `data:application/json,{"p":"gram-20","op":"transfer","tick":"${tick}","amt":"${value}","to":"${recipient.toString(
      { bounceable: true },
    )}"}`;
  }
}

async function makeTransferToAddressInscriptionMsg(
  client,
  rootAddress,
  userAddress,
  params,
) {
  const { tick, protocolFee } = await tokenData(client, rootAddress);
  const userData = await getRecipientData(client, rootAddress, userAddress);
  const userStateInit = loadStateInit(userData.stack.readCell().beginParse());
  const userContractAddress = userData.stack.readAddress();
  const userContractState = await getUserSCState(client, userContractAddress);
  const payload = makeTransferPayload(tick, params);
  if (userContractState !== 'active') {
    return internal({
      to: userContractAddress,
      value: protocolFee,
      init: userStateInit,
      body: beginCell().storeUint(0, 32).storeStringTail(payload).endCell(),
    });
  } else {
    return internal({
      to: userContractAddress,
      value: protocolFee,
      body: beginCell().storeUint(0, 32).storeStringTail(payload).endCell(),
    });
  }
}

export async function transferToken(address, value, memo) {
  const { walletMnemonics } = Meteor.settings;
  const client = new TonClient({
    endpoint: 'https://toncenter-v4.gram20.com/jsonRPC',
  });
  const keys = await mnemonicToWalletKey(walletMnemonics.split(' '));
  const wallet = await WalletContractV4.create({
    workchain: 0,
    publicKey: keys.publicKey,
  });
  //TODO: Maybe enforce this?
  // assert.equal(wallet.address.toString(), Meteor.settings.public.wallet);
  const contract = client.open(wallet);
  const msg = await makeTransferToAddressInscriptionMsg(
    client,
    Address.parse(Meteor.settings.public.tokenAddress),
    wallet.address,
    {
      recipient: Address.parse(address),
      value,
      memo,
    },
  );
  await contract.sendTransfer({
    seqno: await contract.getSeqno(),
    secretKey: keys.secretKey,
    messages: [msg],
  });
}
