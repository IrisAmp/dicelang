import { DiceMod } from './DiceMod';
import * as Types from './DiceMod.Types';

describe('DiceMod', () => {
  /* Parse ================================================================== */
  describe('Parse', () => {
    let dm: DiceMod;

    beforeEach(() => {
      dm = null;
    });

    const compareRR = (actual: Types.IRerollProps[], expected: Types.IRerollProps[]) => {
      if (actual === null) {
        expect(expected).toBeNull();
      } else {
        expect(actual.length).toEqual(expected.length);
        actual.forEach((rr, i) => {
          expect(rr.cp).toEqual(expected[i].cp);
          expect(rr.n).toEqual(expected[i].n);
          expect(rr.o).toEqual(expected[i].o);
        });
      }
    };

    it('should be OK when nothing is passed in', () => {
      dm = new DiceMod();
      expect(dm.successes).toEqual('');
      expect(dm.exploding).toEqual('');
      expect(dm.compounding).toEqual('');
      expect(dm.penetrating).toEqual('');
      expect(dm.keepDrop).toEqual('');
      expect(dm.reroll).toEqual('');
      expect(dm.sort).toEqual('');
      expect(dm.successesProperties).toBeNull();
      expect(dm.explodingProperties).toBeNull();
      expect(dm.compoundingProperties).toBeNull();
      expect(dm.penetratingProperties).toBeNull();
      expect(dm.keepDropProperties).toBeNull();
      expect(dm.rerollProperties.length).toBe(0);
      expect(dm.sortProperties).toBeNull();
    });
    it('should be OK when null is passed in', () => {
      dm = new DiceMod(null);
      expect(dm.successes).toEqual('');
      expect(dm.exploding).toEqual('');
      expect(dm.compounding).toEqual('');
      expect(dm.penetrating).toEqual('');
      expect(dm.keepDrop).toEqual('');
      expect(dm.reroll).toEqual('');
      expect(dm.sort).toEqual('');
      expect(dm.successesProperties).toBeNull();
      expect(dm.explodingProperties).toBeNull();
      expect(dm.compoundingProperties).toBeNull();
      expect(dm.penetratingProperties).toBeNull();
      expect(dm.keepDropProperties).toBeNull();
      expect(dm.rerollProperties.length).toBe(0);
      expect(dm.sortProperties).toBeNull();
    });
    it('should be OK when an empty string is passed in', () => {
      dm = new DiceMod('');
      expect(dm.successes).toEqual('');
      expect(dm.exploding).toEqual('');
      expect(dm.compounding).toEqual('');
      expect(dm.penetrating).toEqual('');
      expect(dm.keepDrop).toEqual('');
      expect(dm.reroll).toEqual('');
      expect(dm.sort).toEqual('');
      expect(dm.successesProperties).toBeNull();
      expect(dm.explodingProperties).toBeNull();
      expect(dm.compoundingProperties).toBeNull();
      expect(dm.penetratingProperties).toBeNull();
      expect(dm.keepDropProperties).toBeNull();
      expect(dm.rerollProperties.length).toBe(0);
      expect(dm.sortProperties).toBeNull();
    });
    it('should be OK when whitespace is passed in', () => {
      dm = new DiceMod('     ');
      expect(dm.successes).toEqual('');
      expect(dm.exploding).toEqual('');
      expect(dm.compounding).toEqual('');
      expect(dm.penetrating).toEqual('');
      expect(dm.keepDrop).toEqual('');
      expect(dm.reroll).toEqual('');
      expect(dm.sort).toEqual('');
      expect(dm.successesProperties).toBeNull();
      expect(dm.explodingProperties).toBeNull();
      expect(dm.compoundingProperties).toBeNull();
      expect(dm.penetratingProperties).toBeNull();
      expect(dm.keepDropProperties).toBeNull();
      expect(dm.rerollProperties.length).toBe(0);
      expect(dm.sortProperties).toBeNull();
    });
    /* Successes/Failures =================================================== */
    describe('Successes/Failures', () => {
      it('should be able to parse simple successes notation', () => {
        dm = new DiceMod('=1');
        expect(dm.successes).toEqual('=1');
        expect(dm.successesProperties.cp).toEqual('=');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).toBeNull();

        dm = new DiceMod('>1');
        expect(dm.successes).toEqual('>1');
        expect(dm.successesProperties.cp).toEqual('>');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).toBeNull();

        dm = new DiceMod('<1');
        expect(dm.successes).toEqual('<1');
        expect(dm.successesProperties.cp).toEqual('<');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).toBeNull();

        dm = new DiceMod('<7');
        expect(dm.successes).toEqual('<7');
        expect(dm.successesProperties.cp).toEqual('<');
        expect(dm.successesProperties.n).toEqual(7);
        expect(dm.successesProperties.f).toBeNull();
      });
      it('should be able to parse success & failure notation', () => {
        dm = new DiceMod('=1f2');
        expect(dm.successes).toEqual('=1f=2');
        expect(dm.successesProperties.cp).toEqual('=');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).not.toBeNull();
        expect(dm.successesProperties.f.cp).toEqual('=');
        expect(dm.successesProperties.f.n).toEqual(2);

        dm = new DiceMod('=1f<2');
        expect(dm.successes).toEqual('=1f<2');
        expect(dm.successesProperties.cp).toEqual('=');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).not.toBeNull();
        expect(dm.successesProperties.f.cp).toEqual('<');
        expect(dm.successesProperties.f.n).toEqual(2);

        dm = new DiceMod('=1f>2');
        expect(dm.successes).toEqual('=1f>2');
        expect(dm.successesProperties.cp).toEqual('=');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).not.toBeNull();
        expect(dm.successesProperties.f.cp).toEqual('>');
        expect(dm.successesProperties.f.n).toEqual(2);

        dm = new DiceMod('=1f>7');
        expect(dm.successes).toEqual('=1f>7');
        expect(dm.successesProperties.cp).toEqual('=');
        expect(dm.successesProperties.n).toEqual(1);
        expect(dm.successesProperties.f).not.toBeNull();
        expect(dm.successesProperties.f.cp).toEqual('>');
        expect(dm.successesProperties.f.n).toEqual(7);
      });
    });
    /* Exploding ============================================================ */
    describe('Exploding', () => {
      it('should be able to parse exploding notation', () => {
        dm = new DiceMod('!');
        expect(dm.exploding).toEqual('!');
        expect(dm.explodingProperties.cp).toEqual('=');
        expect(dm.explodingProperties.n).toBeNull();

        dm = new DiceMod('!=1');
        expect(dm.exploding).toEqual('!=1');
        expect(dm.explodingProperties.cp).toEqual('=');
        expect(dm.explodingProperties.n).toEqual(1);

        dm = new DiceMod('!<1');
        expect(dm.exploding).toEqual('!<1');
        expect(dm.explodingProperties.cp).toEqual('<');
        expect(dm.explodingProperties.n).toEqual(1);

        dm = new DiceMod('!>1');
        expect(dm.exploding).toEqual('!>1');
        expect(dm.explodingProperties.cp).toEqual('>');
        expect(dm.explodingProperties.n).toEqual(1);
      });
    });
    /* Compounding ========================================================== */
    describe('Compounding', () => {
      it('should be able to parse compounding notation', () => {
        dm = new DiceMod('!!');
        expect(dm.compounding).toEqual('!!');
        expect(dm.compoundingProperties.cp).toEqual('=');
        expect(dm.compoundingProperties.n).toBeNull();

        dm = new DiceMod('!!=1');
        expect(dm.compounding).toEqual('!!=1');
        expect(dm.compoundingProperties.cp).toEqual('=');
        expect(dm.compoundingProperties.n).toEqual(1);

        dm = new DiceMod('!!<1');
        expect(dm.compounding).toEqual('!!<1');
        expect(dm.compoundingProperties.cp).toEqual('<');
        expect(dm.compoundingProperties.n).toEqual(1);

        dm = new DiceMod('!!>1');
        expect(dm.compounding).toEqual('!!>1');
        expect(dm.compoundingProperties.cp).toEqual('>');
        expect(dm.compoundingProperties.n).toEqual(1);
      });
    });
    /* Penetrating ========================================================== */
    describe('Penetrating', () => {
      it('should be able to parse penetrating notation', () => {
        dm = new DiceMod('!p');
        expect(dm.penetrating).toEqual('!p');
        expect(dm.penetratingProperties.cp).toEqual('=');
        expect(dm.penetratingProperties.n).toBeNull();

        dm = new DiceMod('!p=1');
        expect(dm.penetrating).toEqual('!p=1');
        expect(dm.penetratingProperties.cp).toEqual('=');
        expect(dm.penetratingProperties.n).toEqual(1);

        dm = new DiceMod('!p<1');
        expect(dm.penetrating).toEqual('!p<1');
        expect(dm.penetratingProperties.cp).toEqual('<');
        expect(dm.penetratingProperties.n).toEqual(1);

        dm = new DiceMod('!p>1');
        expect(dm.penetrating).toEqual('!p>1');
        expect(dm.penetratingProperties.cp).toEqual('>');
        expect(dm.penetratingProperties.n).toEqual(1);
      });
    });
    /* E/C/P Combinations =================================================== */
    describe('E/C/P Combinations', () => {
      it('should be able to parse combinations of exploding, compounding, and penetrating', () => {
        dm = new DiceMod('!!!');
        expect(dm.explodingProperties).not.toBeNull();
        expect(dm.compoundingProperties).not.toBeNull();
        expect(dm.penetratingProperties).toBeNull();

        dm = new DiceMod('!p!');
        expect(dm.explodingProperties).not.toBeNull();
        expect(dm.compoundingProperties).toBeNull();
        expect(dm.penetratingProperties).not.toBeNull();

        dm = new DiceMod('!!!p!');
        expect(dm.explodingProperties).not.toBeNull();
        expect(dm.compoundingProperties).not.toBeNull();
        expect(dm.penetratingProperties).not.toBeNull();

        dm = new DiceMod('!p!!!');
        expect(dm.explodingProperties).not.toBeNull();
        expect(dm.compoundingProperties).not.toBeNull();
        expect(dm.penetratingProperties).not.toBeNull();
      });
    });
    /* Keep/Drop ============================================================ */
    describe('Keep/Drop', () => {
      it('should be able to parse keep/drop notation', () => {
        dm = new DiceMod('k3');
        expect(dm.keepDrop).toEqual('kh3');
        expect(dm.keepDropProperties.kd).toEqual('k');
        expect(dm.keepDropProperties.lh).toEqual('h');
        expect(dm.keepDropProperties.n).toEqual(3);

        dm = new DiceMod('kh3');
        expect(dm.keepDrop).toEqual('kh3');
        expect(dm.keepDropProperties.kd).toEqual('k');
        expect(dm.keepDropProperties.lh).toEqual('h');
        expect(dm.keepDropProperties.n).toEqual(3);

        dm = new DiceMod('kl3');
        expect(dm.keepDrop).toEqual('kl3');
        expect(dm.keepDropProperties.kd).toEqual('k');
        expect(dm.keepDropProperties.lh).toEqual('l');
        expect(dm.keepDropProperties.n).toEqual(3);

        dm = new DiceMod('d2');
        expect(dm.keepDrop).toEqual('dl2');
        expect(dm.keepDropProperties.kd).toEqual('d');
        expect(dm.keepDropProperties.lh).toEqual('l');
        expect(dm.keepDropProperties.n).toEqual(2);

        dm = new DiceMod('dl2');
        expect(dm.keepDrop).toEqual('dl2');
        expect(dm.keepDropProperties.kd).toEqual('d');
        expect(dm.keepDropProperties.lh).toEqual('l');
        expect(dm.keepDropProperties.n).toEqual(2);

        dm = new DiceMod('dh2');
        expect(dm.keepDrop).toEqual('dh2');
        expect(dm.keepDropProperties.kd).toEqual('d');
        expect(dm.keepDropProperties.lh).toEqual('h');
        expect(dm.keepDropProperties.n).toEqual(2);
      });
    });
    /* Rerolls ============================================================== */
    describe('Rerolls', () => {
      it('should be able to parse reroll notation', () => {
        dm = new DiceMod('r');
        expect(dm.reroll).toEqual('r');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: null, o: false },
        ]);

        dm = new DiceMod('r3');
        expect(dm.reroll).toEqual('r=3');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: 3, o: false },
        ]);

        dm = new DiceMod('r=3');
        expect(dm.reroll).toEqual('r=3');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: 3, o: false },
        ]);

        dm = new DiceMod('r<3');
        expect(dm.reroll).toEqual('r<3');
        compareRR(dm.rerollProperties, [
          { cp: '<', n: 3, o: false },
        ]);

        dm = new DiceMod('r>3');
        expect(dm.reroll).toEqual('r>3');
        compareRR(dm.rerollProperties, [
          { cp: '>', n: 3, o: false },
        ]);

        dm = new DiceMod('r>3r');
        expect(dm.reroll).toEqual('r>3r');
        compareRR(dm.rerollProperties, [
          { cp: '>', n: 3, o: false },
          { cp: '=', n: null, o: false },
        ]);

        dm = new DiceMod('r>3rr<4');
        expect(dm.reroll).toEqual('r>3rr<4');
        compareRR(dm.rerollProperties, [
          { cp: '>', n: 3, o: false },
          { cp: '=', n: null, o: false },
          { cp: '<', n: 4, o: false },
        ]);
      });
      it('should be able to parse reroll only notation', () => {
        dm = new DiceMod('ro');
        expect(dm.reroll).toEqual('ro');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: null, o: true },
        ]);

        dm = new DiceMod('ro=2');
        expect(dm.reroll).toEqual('ro=2');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: 2, o: true },
        ]);

        dm = new DiceMod('ro=2r<3');
        expect(dm.reroll).toEqual('ro=2r<3');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: 2, o: true },
          { cp: '<', n: 3, o: false },
        ]);
      });
    });
    /* Sorting ============================================================== */
    describe('Sorting', () => {
      it('should be able to parse sorting notation', () => {
        dm = new DiceMod('s');
        expect(dm.sort).toEqual('sa');
        expect(dm.sortProperties.ad).toEqual('a');

        dm = new DiceMod('sa');
        expect(dm.sort).toEqual('sa');
        expect(dm.sortProperties.ad).toEqual('a');

        dm = new DiceMod('sd');
        expect(dm.sort).toEqual('sd');
        expect(dm.sortProperties.ad).toEqual('d');
      });
    });
    /* Combinations ========================================================= */
    describe('Combinations', () => {
      it('should be able to parse a large combination of modifiers', () => {
        dm = new DiceMod('kh3!!!=4r3r4ro>2<3f>2sd');
        expect(dm.keepDrop).toEqual('kh3');
        expect(dm.compounding).toEqual('!!');
        expect(dm.exploding).toEqual('!=4');
        expect(dm.successes).toEqual('<3f>2');
        expect(dm.sort).toEqual('sd');
        compareRR(dm.rerollProperties, [
          { cp: '=', n: 3, o: false },
          { cp: '=', n: 4, o: false },
          { cp: '>', n: 2, o: true },
        ]);
      });
    });
  });
});
