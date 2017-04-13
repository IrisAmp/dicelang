import { DiceMod } from './DiceMod';

describe('DiceMod', () => {
  describe('parsing', () => {
    it('should be ok when nothing is passed in', () => {
      let d: DiceMod;

      d = new DiceMod();
      expect(d.successes).toEqual('', 'successes should not be parsed on undefined input');
      expect(d.failures).toEqual('', 'failures should not be parsed on undefined input');
      expect(d.exploding).toEqual('', 'exploding should not be parsed on undefined input');
      expect(d.compounding).toEqual('', 'compounding should not be parsed on undefined input');
      expect(d.penetrating).toEqual('', 'penetrating should not be parsed on undefined input');
      expect(d.keepDrop).toEqual('', 'keepDrop should not be parsed on undefined input');
      expect(d.reroll).toEqual('', 'reroll should not be parsed on undefined input');
      expect(d.sort).toEqual('', 'sort should not be parsed on undefined input');

      d = new DiceMod('');
      expect(d.successes).toEqual('', 'successes should not be parsed on empty input.');
      expect(d.failures).toEqual('', 'failures should not be parsed on empty input.');
      expect(d.exploding).toEqual('', 'exploding should not be parsed on empty input.');
      expect(d.compounding).toEqual('', 'compounding should not be parsed on empty input.');
      expect(d.penetrating).toEqual('', 'penetrating should not be parsed on empty input.');
      expect(d.keepDrop).toEqual('', 'keepDrop should not be parsed on empty input.');
      expect(d.reroll).toEqual('', 'reroll should not be parsed on empty input.');
      expect(d.sort).toEqual('', 'sort should not be parsed on empty input.');
    });
    it('should properly parse successes', () => {
      // TODO
    });
    it('should properly parse failures', () => {
      // TODO
    });
    it('should properly parse exploding', () => {
      let d: DiceMod;

      d = new DiceMod("!");
      expect(d.exploding).toEqual('!');

      d = new DiceMod("!6");
      expect(d.exploding).toEqual('!=6');

      d = new DiceMod("!=6");
      expect(d.exploding).toEqual('!=6');

      d = new DiceMod("!>6");
      expect(d.exploding).toEqual('!>6');

      d = new DiceMod("!<6");
      expect(d.exploding).toEqual('!<6');

      expect(() => { d = new DiceMod('!6!'); }).toThrowError();
      expect(() => { d = new DiceMod('!>'); }).toThrowError();
      expect(() => { d = new DiceMod('!<'); }).toThrowError();
      expect(() => { d = new DiceMod('!='); }).toThrowError();
      expect(() => { d = new DiceMod('!=a'); }).toThrowError();
    });
    it('should properly parse compounding', () => {
      let d: DiceMod;

      d = new DiceMod("!!");
      expect(d.compounding).toEqual('!!');

      d = new DiceMod("!!6");
      expect(d.compounding).toEqual('!!=6');

      d = new DiceMod("!!=6");
      expect(d.compounding).toEqual('!!=6');

      d = new DiceMod("!!>6");
      expect(d.compounding).toEqual('!!>6');

      d = new DiceMod("!!<6");
      expect(d.compounding).toEqual('!!<6');

      expect(() => { d = new DiceMod('!!6!!'); }).toThrowError();
      expect(() => { d = new DiceMod('!!>'); }).toThrowError();
      expect(() => { d = new DiceMod('!!<'); }).toThrowError();
      expect(() => { d = new DiceMod('!!='); }).toThrowError();
      expect(() => { d = new DiceMod('!!=a'); }).toThrowError();
    });
    it('should properly parse penetrating', () => {
      let d: DiceMod;

      d = new DiceMod("!p");
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!p6");
      expect(d.penetrating).toEqual('!p=6');

      d = new DiceMod("!p=6");
      expect(d.penetrating).toEqual('!p=6');

      d = new DiceMod("!p>6");
      expect(d.penetrating).toEqual('!p>6');

      d = new DiceMod("!p<6");
      expect(d.penetrating).toEqual('!p<6');

      expect(() => { d = new DiceMod('!p6!p'); }).toThrowError();
      expect(() => { d = new DiceMod('!p>'); }).toThrowError();
      expect(() => { d = new DiceMod('!p<'); }).toThrowError();
      expect(() => { d = new DiceMod('!p='); }).toThrowError();
      expect(() => { d = new DiceMod('!p=a'); }).toThrowError();
    });
    it('should properly parse compund ECP', () => {
      let d: DiceMod;

      d = new DiceMod("!!!");
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('');

      d = new DiceMod("!p!");
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!!!p");
      expect(d.exploding).toEqual('');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!p!!");
      expect(d.exploding).toEqual('');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!p!!!");
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!!!p!");
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod("!!!6");
      expect(d.exploding).toEqual('!=6');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('');
    });
    it('should properly parse keep', () => {
      // TODO
    });
    it('should properly parse drop', () => {
      // TODO
    });
    it('should properly parse rerolls', () => {
      // TODO
    });
    it('should properly parse sorting', () => {
      // TODO
    });
  });
});
