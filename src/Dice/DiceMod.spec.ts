import { DiceMod } from './DiceMod';

describe('DiceMod', () => {
  describe('parsing', () => {
    it('should be ok when nothing is passed in', () => {
      let d: DiceMod;

      d = new DiceMod();
      expect(d.successes).toEqual('', 'successes should not be parsed on undefined input');
      expect(d.exploding).toEqual('', 'exploding should not be parsed on undefined input');
      expect(d.compounding).toEqual('', 'compounding should not be parsed on undefined input');
      expect(d.penetrating).toEqual('', 'penetrating should not be parsed on undefined input');
      expect(d.keepDrop).toEqual('', 'keepDrop should not be parsed on undefined input');
      expect(d.reroll).toEqual('', 'reroll should not be parsed on undefined input');
      expect(d.sort).toEqual('', 'sort should not be parsed on undefined input');

      d = new DiceMod('');
      expect(d.successes).toEqual('', 'successes should not be parsed on empty input.');
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

      d = new DiceMod('!');
      expect(d.exploding).toEqual('!');

      d = new DiceMod('!6');
      expect(d.exploding).toEqual('!=6');

      d = new DiceMod('!=6');
      expect(d.exploding).toEqual('!=6');

      d = new DiceMod('!>6');
      expect(d.exploding).toEqual('!>6');

      d = new DiceMod('!<6');
      expect(d.exploding).toEqual('!<6');

      expect(() => { d = new DiceMod('!6!'); }).toThrowError();
      expect(() => { d = new DiceMod('!>'); }).toThrowError();
      expect(() => { d = new DiceMod('!<'); }).toThrowError();
      expect(() => { d = new DiceMod('!='); }).toThrowError();
      expect(() => { d = new DiceMod('!=a'); }).toThrowError();
    });
    it('should properly parse compounding', () => {
      let d: DiceMod;

      d = new DiceMod('!!');
      expect(d.compounding).toEqual('!!');

      d = new DiceMod('!!6');
      expect(d.compounding).toEqual('!!=6');

      d = new DiceMod('!!=6');
      expect(d.compounding).toEqual('!!=6');

      d = new DiceMod('!!>6');
      expect(d.compounding).toEqual('!!>6');

      d = new DiceMod('!!<6');
      expect(d.compounding).toEqual('!!<6');

      expect(() => { d = new DiceMod('!!6!!'); }).toThrowError();
      expect(() => { d = new DiceMod('!!>'); }).toThrowError();
      expect(() => { d = new DiceMod('!!<'); }).toThrowError();
      expect(() => { d = new DiceMod('!!='); }).toThrowError();
      expect(() => { d = new DiceMod('!!=a'); }).toThrowError();
    });
    it('should properly parse penetrating', () => {
      let d: DiceMod;

      d = new DiceMod('!p');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!p6');
      expect(d.penetrating).toEqual('!p=6');

      d = new DiceMod('!p=6');
      expect(d.penetrating).toEqual('!p=6');

      d = new DiceMod('!p>6');
      expect(d.penetrating).toEqual('!p>6');

      d = new DiceMod('!p<6');
      expect(d.penetrating).toEqual('!p<6');

      expect(() => { d = new DiceMod('!p6!p'); }).toThrowError();
      expect(() => { d = new DiceMod('!p>'); }).toThrowError();
      expect(() => { d = new DiceMod('!p<'); }).toThrowError();
      expect(() => { d = new DiceMod('!p='); }).toThrowError();
      expect(() => { d = new DiceMod('!p=a'); }).toThrowError();
    });
    it('should properly parse compund ECP', () => {
      let d: DiceMod;

      d = new DiceMod('!!!');
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('');

      d = new DiceMod('!p!');
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!!!p');
      expect(d.exploding).toEqual('');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!p!!');
      expect(d.exploding).toEqual('');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!p!!!');
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!!!p!');
      expect(d.exploding).toEqual('!');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('!p');

      d = new DiceMod('!!!6');
      expect(d.exploding).toEqual('!=6');
      expect(d.compounding).toEqual('!!');
      expect(d.penetrating).toEqual('');
    });
    it('should properly parse keep', () => {
      let d: DiceMod;

      d = new DiceMod('k1');
      expect(d.keepDrop).toEqual('kh1');

      d = new DiceMod('kh1');
      expect(d.keepDrop).toEqual('kh1');

      d = new DiceMod('k2');
      expect(d.keepDrop).toEqual('kh2');

      d = new DiceMod('kh2');
      expect(d.keepDrop).toEqual('kh2');

      d = new DiceMod('kl1');
      expect(d.keepDrop).toEqual('kl1');

      d = new DiceMod('kl2');
      expect(d.keepDrop).toEqual('kl2');
    });
    it('should properly parse drop', () => {
      let d: DiceMod;

      d = new DiceMod('d1');
      expect(d.keepDrop).toEqual('dl1');

      d = new DiceMod('dl1');
      expect(d.keepDrop).toEqual('dl1');

      d = new DiceMod('d2');
      expect(d.keepDrop).toEqual('dl2');

      d = new DiceMod('dl2');
      expect(d.keepDrop).toEqual('dl2');

      d = new DiceMod('dh1');
      expect(d.keepDrop).toEqual('dh1');

      d = new DiceMod('dh2');
      expect(d.keepDrop).toEqual('dh2');
    });
    it('should properly parse rerolls', () => {
      let d: DiceMod;

      d = new DiceMod('r');
      expect(d.reroll).toEqual('r');

      d = new DiceMod('ro');
      expect(d.reroll).toEqual('ro');

      d = new DiceMod('r6');
      expect(d.reroll).toEqual('r=6');

      d = new DiceMod('ro6');
      expect(d.reroll).toEqual('ro=6');

      d = new DiceMod('r>6');
      expect(d.reroll).toEqual('r>6');

      d = new DiceMod('ro>6');
      expect(d.reroll).toEqual('ro>6');

      d = new DiceMod('r<6');
      expect(d.reroll).toEqual('r<6');

      d = new DiceMod('ro<6');
      expect(d.reroll).toEqual('ro<6');
    });
    it('should properly parse multiple reroll statements', () => {
      let d: DiceMod;

      d = new DiceMod('rr6');
      expect(d.reroll).toEqual('rr=6');

      d = new DiceMod('r4r6');
      expect(d.reroll).toEqual('r=4r=6');

      d = new DiceMod('r<6r6');
      expect(d.reroll).toEqual('r<6r=6');

      expect(() => { d = new DiceMod('rr'); }).toThrowError();
      expect(() => { d = new DiceMod('rro'); }).toThrowError();
      expect(() => { d = new DiceMod('r=6r=6'); }).toThrowError();
    });
    it('should properly parse sorting', () => {
      let d: DiceMod;

      d = new DiceMod('s');
      expect(d.sort).toEqual('sa');

      d = new DiceMod('sa');
      expect(d.sort).toEqual('sa');

      d = new DiceMod('sd');
      expect(d.sort).toEqual('sd');

      expect(() => { d = new DiceMod('ssa'); }).toThrowError();
    });
  });
});
