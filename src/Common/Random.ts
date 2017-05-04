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

export interface IRandomDevice {
  /**
   * Generate a random number between 0 and 1 inclusive.
   * @returns {number}
   */
  randomReal(): number;
  /**
   * Generate a random integer between the parameters min and max inclusive.
   * @param {number} max
   * @param {number?} min
   * @returns {number}
   */
  randomInt(max: number, min?: number): number;
};

export abstract class BaseRandomDevice implements IRandomDevice {
  public abstract randomReal(): number;

  /**
   * Generate a random integer between the parameters min and max inclusive.
   * @param {number} max
   * @param {number?} min If not supplied, defaults to 1.
   * @returns {number}
   */
  public randomInt(max: number, min = 1): number {
    min = Math.round(min);
    max = Math.round(max);
    if (min === max) {
      return min;
    } else if (max < min) {
      return 0;
    } else {
      return Math.floor(this.randomReal() * (max - min + 1)) + min;
    }
  }
}

export class RandomDevice extends BaseRandomDevice {
  private _buff: ArrayBuffer;

  public constructor() {
    super();
    this._buff = new ArrayBuffer(8);
  }

  /**
   * Generate a random number between 0 and 1 inclusive.
   * @returns {number}
   */
  public randomReal(): number {
    if (getRandomValues) {
      return this._getRandomNumberFromArrayBuff();
    } else {
      return Math.random();
    }
  }

  /**
   * The idea here is to generate a 53 bit random integer using the crypto API
   * and dividing that by MAX_JS_INT to get a random float between 0 and 1
   * inclusive.
   */
  private _getRandomNumberFromArrayBuff(): number {
    // Generate 64 random bits.
    getRandomValues(new Uint8Array(this._buff));
    // We can only create Uint32 views, so we have 2 Uint32s now.
    const view = new Uint32Array(this._buff);
    const lsb = view[1];
    let msb = view[0];
    // Mask the msb for 53 bits total.
    // tslint:disable-next-line:no-bitwise
    msb = msb & INT53_UPPER_MASK;
    // The MSB needs to be shifted 32, but JS treats bitwise ops as 32 bit
    // numbers, so it would overflow. Multiply by 2^32 instead.
    msb *= POW_2_32;
    return (msb + lsb) / MAX_JS_INT;
  }
};

/**
 * A "Random" device that produces numbers based on defined generator functions.
 */
export class NonRandomDevice extends BaseRandomDevice {
  private _realGen: () => number;
  private _intGen: () => number;

  /**
   * @param {() => number} real A function that produces the next "random" real
   * when called.
   * @param {() => number} int A function that produces the next "random" int
   * when called. If it is not supplied, then the next random int
   */
  constructor(real: () => number, int?: () => number) {
    super();
    this._realGen = real;
    this._intGen = int;
  }

  /**
   * Generate a random number between 0 and 1 inclusive.
   * @returns {number}
   */
  public randomReal(): number {
    return this._realGen();
  }

  /**
   * Generate a random integer between the parameters min and max inclusive.
   * @param {number} max
   * @param {number?} min If not supplied, defaults to 1.
   * @returns {number}
   */
  public randomInt(max: number, min = 1): number {
    if (this._intGen) {
      return this._intGen();
    } else {
      return super.randomInt(min, max);
    }
  }
}
