import { init } from '@tma.js/sdk';
import { DummyProxy } from './dummy';

export const Telegram = init ? init({ cssVars: true }) : new DummyProxy();
