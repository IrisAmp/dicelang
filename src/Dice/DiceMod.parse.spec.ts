import { DiceMod } from './DiceMod';

describe('DiceMod', () => {
  describe('parse', () => {
    /* Parse ================================================================ */
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
    });
    /* Successes/Failures =================================================== */
    describe('successes/failures', () => {
      it('should be able to parse simple successes notation', () => {
        let dm: DiceMod;

        dm = new DiceMod('=1');
        expect(dm.successes).toEqual('=1');

        dm = new DiceMod('>1');
        expect(dm.successes).toEqual('>1');

        dm = new DiceMod('<1');
        expect(dm.successes).toEqual('<1');
      });
      it('should be able to parse success & failure notation', () => {
        let dm: DiceMod;

        dm = new DiceMod('=1f2');
        expect(dm.successes).toEqual('=1f=2');
      });
    });
  });
});
