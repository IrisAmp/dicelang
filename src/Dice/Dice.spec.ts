import { Dice } from './Dice';

describe('Dice', () => {
  it('should be able to create dice from expressions', () => {
    const expression = "";
    const expected: Dice[] = [];
    expect(Dice.fromExpression(expression)).toEqual(expected);
  });
});
