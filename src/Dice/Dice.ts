import { MAX_JS_INT, MAX_UINT_32 } from '../Common/Constants';
import { IRandomDevice, RandomDevice } from '../Common/Random';

import { DiceMod } from './DiceMod';

const RD = new RandomDevice();

/**
 * Representation of a dice roll.
 */
export class Dice {
  /**
   * Perform a simple dice roll.
   * @param {number} d The number of faces the dice should have.
   * @param {?number} [n=1] The number of dice to roll. Defaults to 1 if not
   * given.
   * @param {?IRandomDevice} device The random number generator to use in this
   * roll.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   * @throws If the value of d is not between 0 and Dice.maxD inclusive.
   */
  public static roll(d: number, n?: number, device = RD): number[] {
    Dice.checkD(d);
    if (n === undefined) {
      n = 1;
    }
    Dice.checkN(n);

    const result: number[] = [];
    for (let i = 0; i < n; ++i) {
      result.push(device.randomInt(d));
    }
    return result;
  }

  private static _maxD: number = MAX_JS_INT;
  /**
   * The maximum allowed value of d, which is equal to the largest representable
   * integer in JavaScript (9007199254740991, or Number.MAX_SAFE_INTEGER).
   */
  public static get maxD(): number {
    return Dice._maxD;
  }
  public static set maxD(d: number) {
    Dice._maxD = d;
  }

  private static _maxN: number = MAX_JS_INT;
  /**
   * The maximum allowed value of n, which is equal to the largest representable
   * integer in JavaScript (9007199254740991, or Number.MAX_SAFE_INTEGER in
   * ES6).
   */
  public static get maxN(): number {
    return Dice._maxN;
  }
  public static set maxN(n: number) {
    Dice._maxN = n;
  }

  /**
   * The RegExp used to parse the core dice expression.
   */
  protected static get diceRegExp(): RegExp {
    return /^(\d+)?d(f|\d+)(.*)$/ig;
  }

  private static checkD(d: number) {
    if (d < 0 || d > Dice.maxD) {
      throw new Error(`The value of n must be between 0 and ${Dice.maxD} inclusive (got ${d})`);
    }
  }

  private static checkN(n: number) {
    if (n < 0 || n > Dice.maxN) {
      throw new Error(`The value of n must be between 0 and ${Dice.maxN} inclusive (got ${n})`);
    }
  }

  private _device: IRandomDevice;
  private _minRoll: number = 1;
  private _n: number;
  private _d: number;
  private _fate: boolean = false;
  private _mod: DiceMod;
  private _binding: any;
  private _result: number = null;
  private _rolls: number[] = [];
  private _rawRolls: number[] = [];

  /**
   * Create a new dice from the given atomic expression.
   * @param {?string} diceExpr The atomic dice expression to create the dice
   * from. If not given, the dice is initialized as "1d20".
   * @param {?object} binding An object to bind to if the expression includes
   * bindings.
   * @param {?IRandomDevice} device The random number generator that this Dice
   * should use.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   * @throws If the value of d is not between 0 and Dice.maxD inclusive.
   */
  public constructor(diceExpr?: string, binding?: object, device = RD) {
    this._device = device;

    if (!diceExpr) {
      this._d = 20;
      this._n = 1;
      this._mod = new DiceMod();
    } else {
      const parseResult = Dice.diceRegExp.exec(diceExpr);
      if (parseResult == null) {
        throw new Error(`"${diceExpr}" is not a valid expression.`);
      }

      // Parse the mods to fail-fast if there is a problem with the modstring.
      this._mod = new DiceMod(parseResult[3]);

      // Parse the value of n
      if (parseResult[1] === undefined) {
        this._n = 1;
      } else {
        const n = parseInt(parseResult[1], 10);
        Dice.checkN(n);
        this._n = n;
      }

      // Parse the value of d.
      if (parseResult[2] === 'f' || parseResult[2] === 'F') {
        // Use the fate setter.
        this.fate = true;
      } else {
        const d = parseInt(parseResult[2], 10);
        Dice.checkD(d);
        this._fate = false;
        this._d = d;
      }
    }
  }

  /**
   * Get the value of n, which is the number of times the d-sided dice is rolled
   * when roll() is called.
   */
  public get n(): number {
    return this._n;
  }

  /**
   * Set the value of n.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   */
  public set n(value: number) {
    value = Math.round(value);
    Dice.checkN(value);
    this._n = value;
  }

  /**
   * The value of d is the number of faces on this dice. In the case of fate
   * dice, returns 3 (d3).
   */
  public get d(): number {
    if (this._fate) {
      return 3;
    } else {
      return this._d;
    }
  }

  /**
   * Set the value of d. If the dice is a fate dice, the fate attribute is
   * cleared.
   * @throws If the value of d is not between 0 and Dice.maxD inclusive.
   */
  public set d(value: number) {
    value = Math.round(value);
    Dice.checkD(value);
    this._d = value;
    this._fate = false;
    this._minRoll = 1;
  }

  /**
   * True if this dice is a fate dice.
   */
  public get fate(): boolean {
    return this._fate;
  }

  /**
   * Set if this dice is a fate dice. If the value changes to true, the previous
   * value for d is cleared. If the value changes to false, the value of d is
   * set to 3 (the dice becomes a d3 and keeps its value of n). If the new value
   * is the same as the dice's current value, there is no effect.
   */
  public set fate(value: boolean) {
    value = !!value;
    if (value !== this._fate) {
      this._fate = value;
      if (value) {
        this._d = 1;
        this._minRoll = -1;
      } else {
        this._d = 3;
        this._minRoll = 1;
      }
    }
  }

  /**
   * The modifiers for this dice.
   */
  public get mod(): DiceMod {
    return this._mod;
  }

  /**
   * The lowest numeric value that this dice can roll. This is usually 1, except
   * in the case of fate dice, where it is -1.
   */
  public get minRoll(): number {
    return this._minRoll;
  }

  /**
   * Roll the dice. Returns the combined result of the dice roll. Individual
   * rolls are stored in the rolls property.
   * @param {?number} n The number of dice to roll. If not given, defaults to
   * the value of n given when the dice was constructed.
   * @returns {number} The combined result of the dice roll.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   * @throws It is possible for certain types of roll modifiers to continue
   * rolling infinitely. Instead of crashing we throw an error describing where
   * we stopped prematurely. The value of the rolls that we did execute can
   * still be accessed via the rolls property, and the result can still be
   * accessed via the result property.
   */
  public roll(n: number = this.n): number {
    Dice.checkN(n);
    const rolls = [];
    this._rolls.length = 0;
    this._rawRolls.length = 0;
    for (let i = 0; i < n; ++i) {
      const roll = this._device.randomInt(this._d, this._minRoll);
      this._rawRolls.push(roll);
      this._mod.rolled(roll, rolls, this);
    }
    this._result = this._mod.modResult(rolls);
    this._rolls = rolls;
    return this.result;
  }

  /**
   * The most recently rolled result, or null if the dice has never been rolled.
   */
  public get result(): number {
    return this._result;
  }

  /**
   * An array of the individual dice values for the most recent roll.
   */
  public get rolls(): number[] {
    return this._rolls.slice();
  }

  /**
   * An array of the individual dice values for the most recent roll before
   * modifiers were applied.
   */
  public get rawRolls(): number[] {
    return this._rawRolls.slice();
  }

  /**
   * @returns {string} The string representation of the Dice, using Roll20
   * notation.
   */
  public toString(): string {
    return `${this._n}d${this._fate ? 'F' : this._d}${this._mod.toString()}`;
  }

  /**
   * @returns {string} The string representation of the Dice, in English text.
   */
  public toStringPlaintext(): string {
    return `Roll ${this._n} ${this._fate ? 'fate dice' : `d${this._d}${this._n > 1 ? 's' : ''}`}. ${this._mod.toStringPlaintext()}`;
  }
}
