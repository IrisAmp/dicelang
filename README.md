dicelang
========

A JavaScript interpreter for Roll20's [Dice Specification](https://wiki.roll20.net/Dice_Reference).

## Usage
See the `doc` directory for full documentation.
```ts
import { Dice } from 'dicelang';

let d: Dice = new Dice('d20');
alert(d.roll()); // 20
alert(d.roll()); // 1
alert(d.roll()); // 12
```

## License
This software is licensed under the terms of the *MIT license*. See the `LICENSE` file.

The Roll20 Dice Specification is provided under the *Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported license* (CC BY-NC-SA 3.0) by The Orr Group, LLC.
See the `CC-BY-NC-SA-3.txt` file or the [Creative Commons website](https://creativecommons.org/licenses/by-nc-sa/3.0/).
