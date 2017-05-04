import { MAX_JS_INT, MAX_UINT_32 } from '../Common/Constants';
import { Dice } from './Dice';

export class DiceMod {
  /**
   * @param {'<' | '>' | '='} cp The compare point to translate.
   * @returns {string} The english plaintext representation of the compare point.
   * @throws {Error} If the cp param is not a compare point.
   */
  public static comparePointToString(cp: '<' | '>' | '='): string {
    switch (cp) {
      case '<':
        return 'less than or equal to';
      case '>':
        return 'greater than or equal to';
      case '=':
        return 'equal to';
      default:
        throw new Error(`A compare point must be "<", ">", or "=", but got "${cp}".`);
    }
  }

  /**
   * @param {'<' | '>' | '='} cp The compare point to use.
   * @param {number} n The numeric value of the compare point.
   * @param {number} value The number to compare against the compare point.
   * @returns {boolean} True if value "matches" the compare point.
   * @throws {Error} Thrown if cp is not a compare point.
   * @example
   *  comparePoint('>', 3, 4); // => true
   * @example
   *  comparePoint('>', 3, 3); // => true
   * @example
   *  comparePoint('>', 3, 2); // => false
   */
  public static comparePoint(cp: '<' | '>' | '=', n: number, value: number): boolean {
    switch (cp) {
      case '<':
        return value <= n;
      case '>':
        return value >= n;
      case '=':
        return value === n;
      default:
        throw new Error(`A compare point must be "<", ">", or "=", but got "${cp}".`);
    }
  }

  /**
   * The maximum allowed value of n for a dice mod, which is equal to the
   * largest representable integer in JavaScript (9007199254740991, or
   * Number.MAX_SAFE_INTEGER in ES6).
   */
  public static get maxN(): number {
    return MAX_JS_INT;
  }

  /**
   * The RegExp used for parsing successes and failures.
   */
  protected static get successesModRegExpr(): RegExp {
    return /([\<\=\>])(\d+)(?:f([\<\=\>])?(\d+))?/i;
  }

  /**
   * The RegExp used for parsing exploding, compounding, and penetrating.
   */
  protected static get explodeModRegExpr(): RegExp {
    return /(![!p]?)(?:([\<\=\>])?(\d+)|(?![\<\=\>]))/i;
  }

  /**
   * The RegExp used for parsing keep/drop.
   */
  protected static get keepDropModRegExp(): RegExp {
    return /([kd])([lh])?(\d+)/i;
  }

  /**
   * The RegExp used for parsing rerolls.
   */
  protected static get rerollModRegExp(): RegExp {
    return /r(o)?(?:([\<\=\>])?(\d+)|(?![\<\=\>]))/i;
  }

  /**
   * The RegExp used for parsing sorting.
   */
  protected static get sortModRegExp(): RegExp {
    return /s([ad])?/i;
  }

  /**
   * Compare function used to sort numbers ascending.
   */
  protected static sortAscComparator(a: number, b: number): number {
    return a - b;
  }

  /**
   * Compare function used to sort numbers descending.
   */
  protected static sortDesComparator(a: number, b: number): number {
    return b - a;
  }

  private static checkN(n: number) {
    if (n < 0 || n > DiceMod.maxN) {
      throw new Error(`The value of n must be between 0 and ${DiceMod.maxN} inclusive (got ${n})`);
    }
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
    lh: 'l' | 'h';
    n: number;
  } = null;
  private _reroll: Array<{
    cp: '<' | '=' | '>';
    o: boolean;
    n: number;
  }> = [];
  private _sort: {
    ad: 'a' | 'd';
  } = null;

  /**
   * @param {string} modExpr The mod expression to create the DiceMod from.
   * @throws {Error} Thrown when any part of modExpr cannot be parsed.
   */
  public constructor(modExpr?: string) {
    const originalExpr = modExpr;
    if (modExpr) {
      modExpr = modExpr.trim();
    }
    let result: RegExpExecArray;

    // Check for exploding, compounding and penetrating.
    const explodeRegExp = DiceMod.explodeModRegExpr;
    while (result = explodeRegExp.exec(modExpr)) {
      this._parseExplodeResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for keep/drop
    const keepDropRegExp = DiceMod.keepDropModRegExp;
    while (result = keepDropRegExp.exec(modExpr)) {
      this._parseKeepDropResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for rerolls
    const rerollRegExp = DiceMod.rerollModRegExp;
    while (result = rerollRegExp.exec(modExpr)) {
      this._parseRerollResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for successes/failures
    const successesRegExp = DiceMod.successesModRegExpr;
    while (result = successesRegExp.exec(modExpr)) {
      this._parseSucessesResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for sorting
    const sortRegExp = DiceMod.sortModRegExp;
    while (result = sortRegExp.exec(modExpr)) {
      this._parseSortResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    if (modExpr && modExpr.length > 0) {
      throw new Error(`"${originalExpr}" is not a valid modifier: "${modExpr}" could not be parsed.`);
    }
  }

  /**
   * Apply modifiers to a dice that was just rolled and add it to the result in
   * place if necessary.
   * @param {number} roll The value that was just rolled.
   * @param {number[]} result The result object.
   * @param {IDice} dice The dice that was used to roll the value.
   */
  public rolled(roll: number, result: number[], dice: Dice): void {
    const rolls: number[] = this._applyHotModifiers(roll, dice);
    rolls.forEach((r) => result.push(r));
  }

  /**
   * A dice has been rolled and there are no more rolls to make. Modify the
   * final result in place if necessary, and return the combined result of the
   * rolls.
   * @param {number[]} result The result array to modify.
   * @returns {number} The combined total of the roll.
   */
  public modResult(result: number[]): number {
    return this._applySettledModifiers(result);
  }

  /**
   * The normalized string value for successes.
   */
  public get successes(): string {
    return this._successes === null ? '' : `${this._successes.cp}${this._successes.n}${this._failures === null ? '' : `f${this._failures.cp}${this._failures.n}`}`;
  }

  /**
   * The plaintext string value for successes.
   */
  public get successesPlaintext(): string {
    return this._successes === null ? `` : `Count rolls ${DiceMod.comparePointToString(this._successes.cp)} ${this._successes.n}${this._failures === null ? '' : ` minus rolls ${DiceMod.comparePointToString(this._failures.cp)} ${this._failures.n}`} as successes.`;
  }

  /**
   * The normalized string value for exploding.
   */
  public get exploding(): string {
    return this._exploding === null ? '' : `!${this._exploding.n === null ? '' : `${this._exploding.cp}${this._exploding.n}`}`;
  }

  /**
   * The plaintext string value for exploding.
   */
  public get explodingPlaintext(): string {
    if (this._exploding === null) {
      return '';
    }
    let explodeOn: string;
    if (this._exploding.n === null) {
      explodeOn = 'the maximum value';
    } else {
      explodeOn = `rolls ${DiceMod.comparePointToString(this._exploding.cp)} ${this._exploding.n}`;
    }
    return this._exploding === null ? `` : `Explode on ${explodeOn}.`;
  }

  /**
   * The normalized string value for compounding.
   */
  public get compounding(): string {
    return this._compounding === null ? '' : `!!${this._compounding.n === null ? '' : `${this._compounding.cp}${this._compounding.n}`}`;
  }

  /**
   * The plaintext string value for compounding.
   */
  public get compoundingPlaintext(): string {
    if (this._compounding === null) {
      return '';
    }
    let explodeOn: string;
    if (this._compounding.n === null) {
      explodeOn = 'the maximum value';
    } else {
      explodeOn = `rolls ${DiceMod.comparePointToString(this._compounding.cp)} ${this._compounding.n}`;
    }
    return this._compounding === null ? `` : `Compound on ${explodeOn}.`;
  }

  /**
   * The normalized string value for penetrating.
   */
  public get penetrating(): string {
    return this._penetrating === null ? '' : `!p${this._penetrating.n === null ? '' : `${this._penetrating.cp}${this._penetrating.n}`}`;
  }

  /**
   * The plaintext string value for penetrating.
   */
  public get penetratingPlaintext(): string {
    if (this._penetrating === null) {
      return '';
    }
    let explodeOn: string;
    if (this._penetrating.n === null) {
      explodeOn = 'the maximum value';
    } else {
      explodeOn = `rolls ${DiceMod.comparePointToString(this._penetrating.cp)} ${this._penetrating.n}`;
    }
    return this._penetrating === null ? `` : `Penetrate on ${explodeOn}.`;
  }

  /**
   * The normalized string value for keepDrop.
   */
  public get keepDrop(): string {
    return this._keepDrop === null ? '' : `${this._keepDrop.kd}${this._keepDrop.lh}${this._keepDrop.n}`;
  }

  /**
   * The plaintext string value for keepDrop.
   */
  public get keepDropPlaintext(): string {
    return this._keepDrop === null ? `` : `${this._keepDrop.kd === 'k' ? 'Keep' : 'Drop'} the ${this._keepDrop.lh === 'l' ? 'lowest' : 'highest'} ${this._keepDrop.n} roll${this._keepDrop.n > 1 ? 's' : ''}.`;
  }

  /**
   * The normalized string value for reroll.
   */
  public get reroll(): string {
    return this._reroll.length < 1 ? '' : this._reroll.map((x) => `r${x.o ? 'o' : ''}${x.n === null ? `` : `${x.cp}${x.n}`}`).join(``);
  }

  /**
   * The plaintext string value for reroll.
   */
  public get rerollPlaintext(): string {
    let rerolls: any[];
    rerolls = this._reroll.map((x) => `${x.n === null ? 'the lowest value' : `values ${DiceMod.comparePointToString(x.cp)} ${x.n}`}${x.o ? ` only once` : ``}`);
    if (rerolls.length > 1) {
      rerolls[rerolls.length - 1] = `and ${rerolls[rerolls.length - 1]}`;
    }
    return this._reroll.length === 0 ? `` : `Reroll on ${rerolls.join(', ')}.`;
  }

  /**
   * The normalized string value for sort.
   */
  public get sort(): string {
    return this._sort === null ? '' : `s${this._sort.ad}`;
  }

  /**
   * The plaintext string value for sort.
   */
  public get sortPlaintext(): string {
    return this._sort === null ? `` : `Sort ${this._sort.ad === 'a' ? 'ascending' : 'descending'}.`;
  }

  /**
   * The combined value of the modifier as a string.
   * @returns {string}
   */
  public toString(): string {
    return `${this.penetrating}${this.compounding}${this.exploding}${this.keepDrop}${this.reroll}${this.successes}${this.sort}`;
  }

  /**
   * The combined plaintext value of the modifier.
   * @returns {string}
   */
  public toStringPlaintext(): string {
    const mods = [
      this.penetratingPlaintext,
      this.compoundingPlaintext,
      this.explodingPlaintext,
      this.keepDropPlaintext,
      this.rerollPlaintext,
      this.successesPlaintext,
      this.sortPlaintext,
    ];
    return `${mods.join(' ')}`;
  }

  private _parseExplodeResult(result: RegExpExecArray): void {
    const n = result[3] === undefined ? null : parseInt(result[3], 10);
    DiceMod.checkN(n);
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

  private _parseKeepDropResult(result: RegExpExecArray): void {
    if (this._keepDrop !== null) {
      throw new Error(`Keep/Drop already set as "${this.keepDrop}" but parsed "${result[0]}" as well.`);
    }
    const n = parseInt(result[3], 10);
    DiceMod.checkN(n);
    const kd: any = result[1];
    const lh: any = result[2] || (result[1] === 'k' ? 'h' : 'l');
    this._keepDrop = { kd, lh, n };
  }

  private _parseRerollResult(result: RegExpExecArray): void {
    const n = result[3] === undefined ? null : parseInt(result[3], 10);
    DiceMod.checkN(n);
    const o = result[1] !== undefined;
    const cp: any = result[2] === undefined ? '=' : result[2];
    if (this._reroll.filter((x) => x.cp === cp && x.n === n).length > 0) {
      throw new Error(`Reroll on "${cp}${n}" is already set but parsed "${result[0]}" as well.`);
    }
    this._reroll.push({ o, cp, n });
  }

  private _parseSucessesResult(result: RegExpExecArray): void {
    if (this._successes !== null) {
      throw new Error(`Successes/failures already set as "${this.successes}" but parsed "${result[0]}" as well.`);
    }
    const sn = parseInt(result[2], 10);
    DiceMod.checkN(sn);
    const scp = result[1] as any || '=';
    if (result[4]) {
      const fn = parseInt(result[4], 10);
      DiceMod.checkN(fn);
      const fcp = result[3] as any || '=';
      this._failures = {
        cp: fcp,
        n: fn,
      };
    }
    this._successes = {
      cp: scp,
      n: sn,
    };
  }

  private _parseSortResult(result: RegExpExecArray): void {
    if (this._sort !== null) {
      throw new Error(`Sort already set as "${this.sort}" but parsed "${result[0]}" as well.`);
    }
    const ad: any = result[1] || 'a';
    this._sort = { ad };
  }

  private _applyHotModifiers(roll: number, dice: Dice): number[] {
    const queue: Array<{ value: number, rerolled?: boolean, penetrated?: boolean }> = [{ value: roll }];
    const result: number[] = [];
    const shouldExplode = (value: number): boolean => {
      return this._exploding !== null && DiceMod.comparePoint(this._exploding.cp, this._exploding.n === null ? dice.d : this._exploding.n, value);
    };
    const shouldPenetrate = (value: number): boolean => {
      return this._penetrating !== null && DiceMod.comparePoint(this._penetrating.cp, this._penetrating.n === null ? dice.d : this._penetrating.n, value);
    };
    const shouldReroll = (value: number, rerolled: boolean): boolean => {
      if (this._reroll !== null) {
        for (const reroll of this._reroll) {
          const o = reroll.o;
          const cp = reroll.cp ? reroll.cp : '=';
          const n = reroll.n ? reroll.n : dice.minRoll;
          if (!(o && rerolled) && DiceMod.comparePoint(cp, n, value)) {
            return true;
          }
        }
      }
      return false;
    };
    while (queue.length > 0) {
      const next = queue.pop();
      if (shouldExplode(next.value)) {
        queue.push({ value: Dice.roll(dice.d)[0] });
      }
      if (shouldPenetrate(next.value)) {
        queue.push({ value: Dice.roll(dice.d)[0], penetrated: true });
      }
      const compoundedValue = this._applyCompounding(next.value, dice);
      if (shouldReroll(compoundedValue, next.rerolled)) {
        queue.push({ value: Dice.roll(dice.d)[0], rerolled: true });
      } else {
        result.push(compoundedValue - (next.penetrated ? 1 : 0));
      }
    }
    return result;
  }

  private _applySettledModifiers(result: number[]): number {
    this._applyKeepDrop(result);
    if (this._sort !== null) {
      result.sort(this._sort.ad === 'a' ? DiceMod.sortAscComparator : DiceMod.sortDesComparator);
    }
    if (this._successes !== null) {
      return result.reduce((acc, val) => {
        if (DiceMod.comparePoint(this._successes.cp, this._successes.n, val)) {
          ++acc;
        }
        if (this._failures !== null && DiceMod.comparePoint(this._failures.cp, this._failures.n, val)) {
          --acc;
        }
        return acc;
      }, 0);
    } else {
      return result.reduce((acc, val) => acc + val, 0);
    }
  }

  private _applyCompounding(roll: number, dice: Dice): number {
    const shouldCompound = (value: number): boolean => {
      return this._compounding !== null && DiceMod.comparePoint(this._compounding.cp, this._compounding.n === null ? dice.d : this._compounding.n, value);
    };
    let compoundRoll: number = roll;
    while (shouldCompound(compoundRoll)) {
      if (roll >= MAX_JS_INT) {
        throw new Error('Exceeded maximum roll value while applying Compounding modifier.');
      }
      compoundRoll = Dice.roll(dice.d)[0];
      roll += compoundRoll;
    }
    return roll;
  }

  private _applyKeepDrop(result: number[]): void {
    if (this._keepDrop !== null) {
      result.sort(DiceMod.sortAscComparator);
      switch (`${this._keepDrop.kd}${this._keepDrop.lh}`) {
        case 'kh':
          result.splice(0, result.length - this._keepDrop.n);
          break;
        case 'kl':
          result.splice(this._keepDrop.n);
          break;
        case 'dh':
          result.splice(result.length - this._keepDrop.n);
          break;
        case 'dl':
          result.splice(0, this._keepDrop.n);
          break;
        default:
          throw new Error(`Keep/Drop may be one of "kh", "kl", "dh" or "dl", but got "${this._keepDrop.kd}${this._keepDrop.lh}".`);
      }
    }
  }
}
