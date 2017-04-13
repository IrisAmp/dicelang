import { MAX_JS_INT } from '../Common/Constants';
import { Dice } from './Dice';

describe('Dice', () => {
  describe('static roll', () => {
    it('should only roll 1 dice when given no value of n', () => {
      expect(Dice.roll(3).length).toBe(1);
      expect(Dice.roll(4).length).toBe(1);
      expect(Dice.roll(6).length).toBe(1);
      expect(Dice.roll(8).length).toBe(1);
      expect(Dice.roll(10).length).toBe(1);
      expect(Dice.roll(12).length).toBe(1);
      expect(Dice.roll(20).length).toBe(1);
    });

    it('should roll the correct number of dice.', () => {
      expect(Dice.roll(6, 1).length).toBe(1);
      expect(Dice.roll(6, 2).length).toBe(2);
      expect(Dice.roll(6, 3).length).toBe(3);
      expect(Dice.roll(6, 100).length).toBe(100);
      expect(Dice.roll(6, 1000).length).toBe(1000);
    });

    it('should never roll anything outside its bounds', () => {
      /* Tests with randomness? NotLikeThis */
      Dice.roll(6, 100).forEach((roll) => {
        expect(roll).toBeGreaterThanOrEqual(1, `Rolled ${roll} on a d6`);
        expect(roll).toBeLessThanOrEqual(6, `Rolled ${roll} on a d6`);
      });
    });

    it('should throw when given an invalid value for d', () => {
      expect(() => { Dice.roll(-1); }).toThrowError();
      expect(() => { Dice.roll(Infinity); }).toThrowError();
      expect(() => { Dice.roll(Dice.maxD + 1); }).toThrowError();
    });
  });

  describe('parsing', () => {
    it('should properly parse values of d', () => {
      let d: Dice;
      d = new Dice('df');
      expect(d.d).toBe(3);
      expect(d.fate).toBe(true);
      d = new Dice('dF');
      expect(d.d).toBe(3);
      expect(d.fate).toBe(true);
      d = new Dice('d0');
      expect(d.d).toBe(0);
      d = new Dice('d1');
      expect(d.d).toBe(1);
      d = new Dice('d2');
      expect(d.d).toBe(2);
      d = new Dice('d6');
      expect(d.d).toBe(6);
      d = new Dice('d20');
      expect(d.d).toBe(20);
      d = new Dice(`d${MAX_JS_INT}`);
      expect(d.d).toBe(MAX_JS_INT);
    });

    it('should properly parse values of n', () => {
      let d: Dice;
      d = new Dice('0d6');
      expect(d.n).toBe(0);
      d = new Dice('1d6');
      expect(d.n).toBe(1);
      d = new Dice('2d6');
      expect(d.n).toBe(2);
      d = new Dice('10d6');
      expect(d.n).toBe(10);
      d = new Dice(`${MAX_JS_INT}d6`);
      expect(d.n).toBe(MAX_JS_INT);
    });
    it('should throw when given an invalid value of d', () => {
      let d: Dice;
      expect(() => { d = new Dice('dx'); }).toThrowError();
      expect(() => { d = new Dice('d-1'); }).toThrowError();
      expect(() => { d = new Dice('d0'); }).not.toThrowError();
      expect(() => { d = new Dice(`d${MAX_JS_INT}`); }).not.toThrowError();
      expect(() => { d = new Dice(`d${MAX_JS_INT + 1}`); }).toThrowError();
    });

    it('should throw when given an invalid value of n', () => {
      let d: Dice;
      expect(() => { d = new Dice('fd6'); }).toThrowError();
      expect(() => { d = new Dice('-1d6'); }).toThrowError();
      expect(() => { d = new Dice('0d6'); }).not.toThrowError();
      expect(() => { d = new Dice(`${MAX_JS_INT}d6`); }).not.toThrowError();
      expect(() => { d = new Dice(`${MAX_JS_INT + 1}d6`); }).toThrowError();
    });
  });
});
