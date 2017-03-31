import {
  tokenize,
} from './Parser';

describe('Parser', () => {
  describe('tokenize', () => {
    it('should should be able to parse strings into valid IExpressions', () => {
      expect(tokenize('')).toEqual(['']);

      expect(tokenize('Hello world')).toEqual(['Hello world']);

      expect(tokenize('(Hello world)')).toEqual([['Hello world']]);

      expect(tokenize('Hello (world)')).toEqual(['Hello ', ['world']]);

      expect(tokenize('He(llo) wo(rld)')).toEqual(['He', ['llo'], ' wo', ['rld']]);

      expect(tokenize('Hello ((wo)rld)')).toEqual(['Hello ', [['wo'], 'rld']]);

      expect(tokenize('He(ll)o ((wo)r(l)d)')).toEqual(['He', ['ll'], 'o ', [['wo'], 'r', ['l'], 'd']]);

      expect(tokenize('()Hello world')).toEqual([[''], 'Hello world']);
    });

    it('should detect invalid expressions and throw', () => {
      const parseFn = (input: string) => {
        return () => {
          tokenize(input);
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
