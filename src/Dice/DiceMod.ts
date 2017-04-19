import { MAX_JS_INT } from '../Common/Constants';
import { Dice } from './Dice';

export class DiceMod {
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
    return /r(o)?(?:([\<\=\>])?(\d+)|(?![\<\=\>]))/i;
  }

  protected static get sortModRegExp(): RegExp {
    return /s([ad])?/i;
  }

  protected static sortAscComparator(a: number, b: number): number {
    return a - b;
  }

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

  public constructor(modExpr?: string) {
    const originalExpr = modExpr;
    let result: RegExpExecArray;

    // Check for exploding, compounding and penetrating.
    const explodeRegExp = DiceMod.explodeModRegExpr;
    while (result = explodeRegExp.exec(modExpr)) {
      this.parseExplodeResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for keep/drop
    const keepDropRegExp = DiceMod.keepDropModRegExp;
    while (result = keepDropRegExp.exec(modExpr)) {
      this.parseKeepDropResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for rerolls
    const rerollRegExp = DiceMod.rerollModRegExp;
    while (result = rerollRegExp.exec(modExpr)) {
      this.parseRerollResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for successes/failures
    const successesRegExp = DiceMod.successesModRegExpr;
    while (result = successesRegExp.exec(modExpr)) {
      this.parseSucessesResult(result);
      modExpr = modExpr.replace(result[0], '');
    }

    // Check for sorting
    const sortRegExp = DiceMod.sortModRegExp;
    while (result = sortRegExp.exec(modExpr)) {
      this.parseSortResult(result);
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
   * @param {Dice} dice The dice that was used to roll the value.
   */
  public rolled(roll: number, result: number[], dice: Dice): void {
    const rolls: number[] = [roll];
    this.applyECP(rolls, dice);
    this.applyReroll(rolls, dice);
    this.applyKeepDrop(rolls, result);
  }

  /**
   * A dice has been rolled and there are no more rolls to make. Modify the
   * final result in place if necessary, and return the combined result of the
   * rolls.
   * @param {number[]} result The result array to modify.
   * @returns {number} The combined total of the roll.
   */
  public modResult(result: number[]): number {
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

  public get successes(): string {
    return this._successes === null ? '' : `${this._successes.cp}${this._successes.n}${this._failures === null ? '' : `f${this._failures.cp}${this._failures.n}`}`;
  }

  public get successesPlaintext(): string {
    return this._successes === null ? `` : `Count rolls ${DiceMod.comparePointToString(this._successes.cp)} ${this._successes.n}${this._failures === null ? '' : ` minus rolls ${DiceMod.comparePointToString(this._failures.cp)} ${this._failures.n}`} as successes.`;
  }

  public get exploding(): string {
    return this._exploding === null ? '' : `!${this._exploding.n === null ? '' : `${this._exploding.cp}${this._exploding.n}`}`;
  }

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

  public get compounding(): string {
    return this._compounding === null ? '' : `!!${this._compounding.n === null ? '' : `${this._compounding.cp}${this._compounding.n}`}`;
  }

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

  public get penetrating(): string {
    return this._penetrating === null ? '' : `!p${this._penetrating.n === null ? '' : `${this._penetrating.cp}${this._penetrating.n}`}`;
  }

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

  public get keepDrop(): string {
    return this._keepDrop === null ? '' : `${this._keepDrop.kd}${this._keepDrop.lh}${this._keepDrop.n}`;
  }

  public get keepDropPlaintext(): string {
    return this._keepDrop === null ? `` : `${this._keepDrop.kd === 'k' ? 'Keep' : 'Drop'} the ${this._keepDrop.lh === 'l' ? 'lowest' : 'highest'} ${this._keepDrop.n} roll${this._keepDrop.n > 1 ? 's' : ''}.`;
  }

  public get reroll(): string {
    return this._reroll.length < 1 ? '' : this._reroll.map((x) => `r${x.o ? 'o' : ''}${x.n === null ? `` : `${x.cp}${x.n}`}`).join(``);
  }

  public get rerollPlaintext(): string {
    let rerolls: any[];
    rerolls = this._reroll.map((x) => `${x.n === null ? 'the lowest value' : `values ${DiceMod.comparePointToString(x.cp)} ${x.n}`}${x.o ? ` only once` : ``}`);
    if (rerolls.length > 1) {
      rerolls[rerolls.length - 1] = `and ${rerolls[rerolls.length - 1]}`;
    }
    return this._reroll.length === 0 ? `` : `Reroll on ${rerolls.join(', ')}.`;
  }

  public get sort(): string {
    return this._sort === null ? '' : `s${this._sort.ad}`;
  }

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

  private parseExplodeResult(result: RegExpExecArray): void {
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

  private parseKeepDropResult(result: RegExpExecArray): void {
    if (this._keepDrop !== null) {
      throw new Error(`Keep/Drop already set as "${this.keepDrop}" but parsed "${result[0]}" as well.`);
    }
    const n = parseInt(result[3], 10);
    DiceMod.checkN(n);
    const kd: any = result[1];
    const lh: any = result[2] || (result[1] === 'k' ? 'h' : 'l');
    this._keepDrop = { kd, lh, n };
  }

  private parseRerollResult(result: RegExpExecArray): void {
    const n = result[3] === undefined ? null : parseInt(result[3], 10);
    DiceMod.checkN(n);
    const o = result[1] !== undefined;
    const cp: any = result[2] === undefined ? '=' : result[2];
    if (this._reroll.filter((x) => x.cp === cp && x.n === n).length > 0) {
      throw new Error(`Reroll on "${cp}${n}" is already set but parsed "${result[0]}" as well.`);
    }
    this._reroll.push({ o, cp, n });
  }

  private parseSucessesResult(result: RegExpExecArray): void {
    if (this._successes !== null) {
      throw new Error(`Successes/failures already set as "${this.successes}" but parsed "${result[0]}" as well.`);
    }
    const sn = parseInt(result[2], 10);
    DiceMod.checkN(sn);
    const scp = result[1] as any || '=';
    if (result[3] && result[4]) {
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

  private parseSortResult(result: RegExpExecArray): void {
    if (this._sort !== null) {
      throw new Error(`Sort already set as "${this.sort}" but parsed "${result[0]}" as well.`);
    }
    const ad: any = result[1] || 'a';
    this._sort = { ad };
  }

  private applyECP(rolls: number[], dice: Dice) {
    // TODO
  }

  private applyReroll(rolls: number[], dice: Dice): void {
    // TODO
  }

  private applyKeepDrop(rolls: number[], result: number[]): void {
    if (this._keepDrop !== null) {
      rolls.forEach((r) => {
        if (true /* TODO */) {
          result.push(r);
        }
      });
    } else {
      // There is no K/D modifier, just add everything.
      rolls.forEach((r) => result.push(r));
    }
  }
}
