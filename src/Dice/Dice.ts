import { getRandomInt } from '../Common/Random';

export class DiceMod {
  public static fromModExpression(expr: string): DiceMod {
    const result = new DiceMod();
    return result;
  }

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
   * final result in place if necessary.
   * @param {number[]} result The result array to modify.
   */
  public modResult(result: number[]) {
    //
  }

  public toString(): string {
    return ``;
  }
}

export class Dice {
  public static roll(d: number, n?: number): number[] {
    if (d < 1) {
      throw new Error(`d must be a natural number (got ${d})`);
    }
    if (n === undefined) {
      n = 1;
    }
    if (n < 1) {
      throw new Error(`n must be a natural number (got ${n})`);
    }

    const result: number[] = [];
    for (let i = 0; i < n; ++i) {
      result.push(getRandomInt(1, d));
    }
    return result;
  }

  public static fromExpression(expression: string): Dice[] {
    const result: Dice[] = [];
    return result;
  }

  protected static get diceRegExp(): RegExp {
    return /^(\d+)?d(f|\d+)(.*)$/i;
  }

  private _minRoll: number = 1;
  private _n: number;
  private _d: number;
  private _fate: boolean;
  private _mod: DiceMod;
  private _binding: any;
  private _lastRolls: number[];

  /**
   * Create a new dice from the given atomic expression.
   * @param {string} diceExpr The atomic dice expression to create the dice from.
   * @param {object} binding An object to bind to if the expression includes bindings.
   */
  public constructor(diceExpr: string, binding?: object) {
    const parseResult = Dice.diceRegExp.exec(diceExpr);
    if (parseResult == null) {
      throw new Error(`"${diceExpr}" is not a valid dice expression.`);
    }
    this._mod = new DiceMod(parseResult[3]);
    if (parseResult[1] === undefined) {
      this._n = 1;
    } else {
      this._n = parseInt(parseResult[1], 10);
    }
    if (parseResult[2] === 'f') {
      this._minRoll = -1;
      this._d = 1;
      this._fate = true;
    } else {
      this._d = parseInt(parseResult[2], 10);
      this._fate = false;
    }
  }

  public roll(): number[] {
    const result = [];
    for (let i = 0; i < this._n; ++i) {
      const roll = getRandomInt(this._minRoll, this._d);
      this._mod.rolled(roll, result, this);
    }
    this._mod.modResult(result);
    return result;
  }

  public toString(): string {
    return `${this._n}d${this._fate ? 'f' : this._d}${this._mod.toString()}`;
  }
}
