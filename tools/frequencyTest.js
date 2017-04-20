const d = new (require('../dist').Dice)('d10');

for (let i = 0; i < 100000; ++i) {
  console.log(`${d.roll()}`);
}
