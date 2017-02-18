import { BaseGA } from './BaseGA';
import { loop, syncLoop } from './loop';

export class BrowserGA extends BaseGA {
    _loop(cond, body, done) {
        loop(cond, body, done);
    }
}

export class NodeGA extends BaseGA {
    constructor(preferences, workerOptions = {}, reference, rate) {
        super(preferences, workerOptions, reference, rate);
        this._rate = rate;
    }
    _loop(cond, body, done) {
        //debounceLoop(cond, body, done, this._rate);
        syncLoop(cond, body, done);
    }
}

const isNode = new Function('try { return this === global; } catch(e) { return false; }')();
console.log(`ENVIRONMENT: ${isNode ? 'NodeJS' : 'Browser'}`);
export const GA = isNode ? NodeGA : BrowserGA;