import {
  INT53_UPPER_MASK,
  MAX_JS_INT,
  MAX_UINT_32,
  POW_2_32,
} from './Constants';

let getRandomValues;
try {
  // tslint:disable-next-line:no-var-requires
  getRandomValues = require('get-random-values');
} catch (e) {
  console.error(new Error('Enviroment does not support the crypto API.'));
}

const buff = new ArrayBuffer(8);
/**
 * Generates a random real number between 0 and 1 inclusive. Uses the JavaScript
 * crypto API if available, otherwise uses Math.random().
 * @returns {number} A random real number between 0 and 1 inclusive.
 */
export function getRandomNumber(): number {
  if (getRandomValues) {
    // Generate 64 random bits.
    getRandomValues(new Uint8Array(buff));
    // We can only create Uint32 views, so we have 2 Uint32s now.
    const view = new Uint32Array(buff);
    const lsb = view[1];
    let msb = view[0];
    // Mask the msb for 53 bits total.
    // tslint:disable-next-line:no-bitwise
    msb = msb & INT53_UPPER_MASK;
    // The MSB needs to be shifted 32, but JS treats bitwise ops as 32 bit
    // numbers, so it would overflow. Multiply by 2^32 instead.
    msb *= POW_2_32;
    return (msb + lsb) / MAX_JS_INT;
  } else {
    return Math.random();
  }
}

/**
 * Get a random integer between min and max inclusive. The values of min and max
 * are first rounded using Math.round(). The JavaScript crypto APIs are used if
 * available, otherwise Math.random() is used.
 * @param {number} min
 * @param {number} max
 * @returns {number} A random integer between min and max inclusive, or 0 if max
 * is less than min.
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.round(min);
  max = Math.round(max);
  if (min === max) {
    return min;
  } else if (max < min) {
    return 0;
  } else {
    return Math.floor(getRandomNumber() * (max - min)) + min + 1;
  }
}
