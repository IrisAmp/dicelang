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

  public get successesPlaintext(): string {
    return this._successes === null ? `` : ``;
  }

  public get failures(): string {
    return this._failures === null ? '' : ``;
  }

  public get failuresPlaintext(): string {
    return this._failures === null ? `` : ``;
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
    return `${this.penetrating}${this.compounding}${this.exploding}${this.keepDrop}${this.reroll}${this.successes}${this.failures}${this.sort}`;
  }

  public toStringPlaintext(): string {
    let mods = [
      this.penetratingPlaintext,
      this.compoundingPlaintext,
      this.explodingPlaintext,
      this.keepDropPlaintext,
      this.rerollPlaintext,
      this.successesPlaintext,
      this.failuresPlaintext,
      this.sortPlaintext,
    ];
    return `${mods.join(' ')}`;
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

  private parseKeepDropResult(result?: RegExpExecArray): void {
    if (this._keepDrop !== null) {
      throw new Error(`Keep/Drop already set as "${this.keepDrop}" but parsed "${result[0]}" as well.`);
    }
    const kd: any = result[1];
    const lh: any = result[2] || (result[1] === 'k' ? 'h' : 'l');
    const n = parseInt(result[3], 10);
    this._keepDrop = { kd, lh, n };
  }

  private parseRerollResult(result?: RegExpExecArray): void {
    const o = result[1] !== undefined;
    const cp: any = result[2] === undefined ? '=' : result[2];
    const n = result[3] === undefined ? null : parseInt(result[3], 10);
    if (this._reroll.filter((x) => x.cp === cp && x.n === n).length > 0) {
      throw new Error(`Reroll on "${cp}${n}" is already set but parsed "${result[0]}" as well.`);
    }
    this._reroll.push({ o, cp, n });
  }

  private parseSortResult(result?: RegExpExecArray): void {
    if (this._sort !== null) {
      throw new Error(`Sort already set as "${this.sort}" but parsed "${result[0]}" as well.`);
    }
    const ad: any = result[1] || 'a';
    this._sort = { ad };
  }
}
