import { DiceMod } from './DiceMod';

describe('DiceMod', () => {
  /* Parse ================================================================== */
  describe('Parse', () => {
    it('should be OK when nothing is passed in', () => {
      let dm: DiceMod;

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
      let dm: DiceMod;

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
      let dm: DiceMod;

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
      let dm: DiceMod;

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
        let dm: DiceMod;
        let props;

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
        let dm: DiceMod;

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

    });
    /* Compounding ========================================================== */
    describe('Compounding', () => {

    });
    /* Penetrating ========================================================== */
    describe('Penetrating', () => {

    });
    /* E/C/P Combinations =================================================== */
    describe('E/C/P Combinations', () => {

    });
    /* Keep/Drop =================================================== */
    describe('Keep/Drop', () => {

    });
    /* Rerolls =================================================== */
    describe('Rerolls', () => {

    });
    /* Sorting =================================================== */
    describe('Sorting', () => {

    });
  });
});
