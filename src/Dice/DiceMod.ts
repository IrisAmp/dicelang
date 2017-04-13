import { Dice } from './Dice';

export class DiceMod {
  protected static get successesModRegExpr(): RegExp {
    return /([\<\=\>])(\d+)(?:f([\<\=\>])?(\d+))?/i;
  }

  protected static get explodeModRegExpr(): RegExp {
    return /(![!p]?)(?:([\<\=\>])?(\d+)|(?![\<\=\>]))/i;
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
  } = null;
  private _failures: {
    cp: '<' | '=' | '>';
    n: number;
  } = null;
  private _exploding: {
    cp: '<' | '=' | '>';
    n: number;
  } = null;
  private _compounding: {
    cp: '<' | '=' | '>';
    n: number;
  } = null;
  private _penetrating: {
    cp: '<' | '=' | '>';
    n: number;
  } = null;
  private _keepDrop: {
    kd: 'k' | 'd';
    side: 'l' | 'h';
    n: number;
  } = null;
  private _reroll: {
    cp: '<' | '=' | '>';
    o: boolean;
    n: number;
  } = null;
  private _sort: {
    direction: 'a' | 'd';
  } = null;

  public constructor(modExpr?: string) {
    const originalExpr = modExpr;
    let result: RegExpExecArray;

    // Check for exploding, compounding and penetrating.
    const explodeRegExp = DiceMod.explodeModRegExpr;
    while (result = explodeRegExp.exec(modExpr)) {
      this.parseExplodeResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    if (modExpr && modExpr.length > 0) {
      throw new Error(`${originalExpr} is not a valid modifier: "${modExpr}" could not be parsed.`);
    }
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

  public get successes(): string {
    return this._successes === null ? '' : ``;
  }

  public get failures(): string {
    return this._failures === null ? '' : ``;
  }

  public get exploding(): string {
    return this._exploding === null ? '' : `!${this._exploding.n === null ? '' : `${this._exploding.cp}${this._exploding.n}`}`;
  }

  public get compounding(): string {
    return this._compounding === null ? '' : `!!${this._compounding.n === null ? '' : `${this._compounding.cp}${this._compounding.n}`}`;
  }

  public get penetrating(): string {
    return this._penetrating === null ? '' : `!p${this._penetrating.n === null ? '' : `${this._penetrating.cp}${this._penetrating.n}`}`;
  }

  public get keepDrop(): string {
    return this._keepDrop === null ? '' : ``;
  }

  public get reroll(): string {
    return this._reroll === null ? '' : ``;
  }

  public get sort(): string {
    return this._sort === null ? '' : ``;
  }

  /**
   * The combined value of the modifier as a string. The order of tokens is:
   * - Penetrating
   * - Compounding
   * - Exploding
   * - Keep/Drop
   * - Reroll
   * - Successes
   * - Failures
   * - Sorting
   * @returns {string}
   */
  public toString(): string {
    return `${this.penetrating}${this.compounding}${this.exploding}${this.keepDrop}${this.reroll}${this.successes}${this.failures}${this.sort}`;
  }

  private parseExplodeResult(result?: RegExpExecArray): void {
    const n = result[3] === undefined ? null : parseInt(result[3], 10);
    const cp = result[2] as any || '=';
    const parsed = { cp, n };
    switch (result[1]) {
      case '!':
        // Exploding
        if (this._exploding !== null) {
          throw new Error(`Exploding already set as "${this.exploding}" but parsed "${result[0]}" as well.`);
        }
        this._exploding = parsed;
        break;
      case '!!':
        // Compounding
        if (this._compounding !== null) {
          throw new Error(`Compounding already set as "${this.compounding}" but parsed "${result[0]}" as well.`);
        }
        this._compounding = parsed;
        break;
      case '!p':
        // Penetrating
        if (this._penetrating !== null) {
          throw new Error(`Penetrating already set as "${this.penetrating}" but parsed "${result[0]}" as well.`);
        }
        this._penetrating = parsed;
        break;
      default:
        // This shouldn't be possible.
        throw new Error(`explodeModRegExp should only match "!", "!!", or "!p" but it matched "${result[1]}".`);
    }
  }
}
