import {
  parenthesize,
} from './Parser';

describe('Parser', () => {
  describe('parenthesize', () => {
    it('should should be able to parse strings into valid IExpressions', () => {
      expect(parenthesize('')).toEqual(['']);

      expect(parenthesize('Hello world')).toEqual(['Hello world']);

      expect(parenthesize('(Hello world)')).toEqual([['Hello world']]);

      expect(parenthesize('Hello (world)')).toEqual(['Hello ', ['world']]);

      expect(parenthesize('He(llo) wo(rld)')).toEqual(['He', ['llo'], ' wo', ['rld']]);

      expect(parenthesize('Hello ((wo)rld)')).toEqual(['Hello ', [['wo'], 'rld']]);

      expect(parenthesize('He(ll)o ((wo)r(l)d)')).toEqual(['He', ['ll'], 'o ', [['wo'], 'r', ['l'], 'd']]);

      expect(parenthesize('()Hello world')).toEqual([[''], 'Hello world']);
    });

    it('should detect invalid expressions and throw', () => {
      const parseFn = (input: string) => {
        return () => {
          parenthesize(input);
        };
      };

      expect(parseFn('(')).toThrow();

      expect(parseFn(')')).toThrow();

      expect(parseFn('Hello ( world')).toThrow();

      expect(parseFn('He()llo ) world')).toThrow();

      expect(parseFn('(()))')).toThrow();

      expect(parseFn('(()()')).toThrow();

      expect(parseFn(')(')).toThrow();
    });
  });
});
