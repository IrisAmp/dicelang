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
      expect(() => { Dice.roll(0); }).toThrowError(/0/);
      expect(() => { Dice.roll(-1); }).toThrowError(/\-1/);
      expect(() => { Dice.roll(Infinity); }).toThrowError(/Infinity/);
    });
  });
});
