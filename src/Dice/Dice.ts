import { getRandomInt } from '../Common/Random';

export class DiceMod {
  protected static get successesModRegExpr(): RegExp {
    return /([\<\=\>])(\d+)(?:f([\<\=\>])?(\d+))?/i;
  }

  protected static get explodeModRegExpr(): RegExp {
    return /(![!p]?)([\<\=\>])?(\d+)/i;
  }

  protected static get keepDropModRegExp(): RegExp {
    return /([kd])([lh])?(\d+)/i;
  }

  protected static get rerollModRegExp(): RegExp {
    return /(ro?)([\<\=\>])(\d+)/i;
  }

  protected static get sortModRegExp(): RegExp {
    return /s([ad])?/i;
  }

  private _successes: {
    cp: '<' | '=' | '>';
    n: number;
  };
  private _failures: {
    cp: '<' | '=' | '>';
    n: number;
  };
  private _exploding: {
    cp: '<' | '=' | '>';
    n: number;
  };
  private _compounding: {
    cp: '<' | '=' | '>';
    n: number;
  };
  private _penetrating: {
    cp: '<' | '=' | '>';
    n: number;
  };
  private _keepDrop: {
    kd: 'k' | 'd';
    side: 'l' | 'h';
    n: number;
  };
  private _reroll: {
    o: boolean;
  };
  private _sort: {
    direction: 'a' | 'd';
  };

  public constructor(modExpr?: string) {
    //
  }

  /**
   * Apply modifiers to a dice that was just rolled and add it to the result in
   * place if necessary.
   * @param {number} roll The value that was just rolled.
   * @param {number[]} result The result object.
   * @param {Dice} dice The dice that was used to roll the value.
   */
  public rolled(roll: number, result: number[], dice: Dice): void {
    result.push(roll);
  }

  /**
   * A dice has been rolled and there are no more rolls to make. Modify the
   * final result in place if necessary, and return the combined result of the
   * rolls.
   * @param {number[]} result The result array to modify.
   * @returns {number} The combined total of the roll.
   */
  public modResult(result: number[]): number {
    return result.reduce((acc, val) => acc + val, 0);
  }

  public toString(): string {
    return ``;
  }
}

/**
 * Representation of a dice roll.
 */
export class Dice {
  /**
   * The maximum allowed value of d, which is equal to the maximum value of a
   * UInt32 (4294967295).
   */
  public static get maxD(): number {
    return 4294967295;
  }

  /**
   * The maximum allowed value of n, which is equal to the largest representable
   * integer in JavaScript (9007199254740991, or Number.MAX_SAFE_INTEGER).
   */
  public static get maxN(): number {
    return 9007199254740991;
  }

  /**
   * Perform a simple dice roll.
   * @param {number} d The number of faces the dice should have.
   * @param {number} n The number of dice to roll. Defaults to 1 if not given.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   * @throws If the value of d is not between 0 and Dice.maxD inclusive.
   */
  public static roll(d: number, n?: number): number[] {
    Dice.checkD(d);
    if (n === undefined) {
      n = 1;
    }
    Dice.checkN(n);

    const result: number[] = [];
    for (let i = 0; i < n; ++i) {
      result.push(getRandomInt(1, d));
    }
    return result;
  }

  protected static get diceRegExp(): RegExp {
    return /^(\d+)?d(f|\d+)(.*)$/i;
  }

  private static checkD(d: number) {
    if (d < 1 || d > Dice.maxD) {
      throw new Error(`The value of n must be between 0 and ${Dice.maxD} inclusive (got ${d})`);
    }
  }

  private static checkN(n: number) {
    if (n < 1 || n > Dice.maxN) {
      throw new Error(`The value of n must be between 0 and ${Dice.maxN} inclusive (got ${n})`);
    }
  }

  private _minRoll: number = 1;
  private _n: number;
  private _d: number;
  private _fate: boolean = false;
  private _mod: DiceMod;
  private _binding: any;
  private _rolls: number[];

  /**
   * Create a new dice from the given atomic expression.
   * @param {?string} diceExpr The atomic dice expression to create the dice
   * from. If not given, the dice is initialized as "1d20".
   * @param {?object} binding An object to bind to if the expression includes
   * bindings.
   * @throws If the value of n is not between 0 and Dice.maxN inclusive.
   * @throws If the value of d is not between 0 and Dice.maxD inclusive.
   */
  public constructor(diceExpr?: string, binding?: object) {
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
      if (parseResult[2] === 'f') {
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
   * Roll the dice. Returns the combined result of the dice roll. Individual
   * rolls are stored in the rolls property.
   * @param {?number} n The number of dice to roll. If not supplied, defaults to
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
    for (let i = 0; i < n; ++i) {
      const roll = getRandomInt(this._minRoll, this._d);
      this._rolls.push(roll);
      this._mod.rolled(roll, rolls, this);
    }
    return this._mod.modResult(rolls);
  }

  /**
   * The raw values of the last dice roll, before they were modified using this
   * Dice's DiceMod.
   */
  public get rolls(): number[] {
    return this._rolls.slice();
  }

  public toString(): string {
    return `${this._n}d${this._fate ? 'F' : this._d}${this._mod.toString()}`;
  }
}
