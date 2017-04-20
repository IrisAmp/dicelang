import { Dice } from '../../src/index';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IAppState {
  dice: Dice;
  error: string;
  normalizedSpec: string;
  description: string;
  lastTotal: number;
  lastRolls: string;
  lastRollsBeforeMods: string;
}

class App extends React.Component<any, IAppState> {
  public constructor(props, context) {
    super(props, context);

    const dice = new Dice();
    this.state = {
      description: dice.toStringPlaintext(),
      dice,
      error: null,
      lastRolls: null,
      lastRollsBeforeMods: null,
      lastTotal: null,
      normalizedSpec: dice.toString(),
    };
  }

  public render() {
    return (
      <div style={{ margin: '2em', maxWidth: '100%', wordWrap: 'break-word' }}>
        <div>
          <input
            style={{ fontFamily: 'monospace', width: '20em' }}
            placeholder={`Enter the dice to roll!`}
            onKeyPress={(e) => this.handleKeyDown(e)}
            onChange={(e) => this.handleChange(e)} />
          <button onClick={() => this.roll()}>Roll!</button>
        </div>
        <div>
          <h3 style={{ fontFamily: 'sans-serif' }}>Normalized Spec</h3>
          <p><code>{this.state.normalizedSpec || 'n/a'}</code></p>
          <h3 style={{ fontFamily: 'sans-serif' }}>Description</h3>
          <p><code>{this.state.description || 'n/a'}</code></p>
          <h3 style={{ fontFamily: 'sans-serif' }}>Last Total</h3>
          <p><code>{this.state.lastTotal || 'n/a'}</code></p>
          <h3 style={{ fontFamily: 'sans-serif' }}>Last Rolls</h3>
          <p><code>{this.state.lastRolls || 'n/a'}</code></p>
          <h3 style={{ fontFamily: 'sans-serif' }}>Last Rolls Before Mods</h3>
          <p><code>{this.state.lastRollsBeforeMods || 'n/a'}</code></p>
          <h3 style={{ fontFamily: 'sans-serif' }}>Errors</h3>
          <p><code>{this.state.error || 'n/a'}</code></p>
        </div>
      </div>
    );
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const newDice = new Dice(event.target.value);
      this.setState({
        description: newDice.toStringPlaintext(),
        dice: newDice,
        error: null,
        normalizedSpec: newDice.toString(),
      });
    } catch (e) {
      console.error(e);
      this.setState({
        description: null,
        dice: null,
        error: e.message,
        normalizedSpec: null,
      });
    }
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      this.roll();
    }
  }

  private roll() {
    if (this.state.dice) {
      try {
        this.state.dice.roll();
        this.setState({
          error: null,
          lastRolls: this.state.dice.rolls.join(', '),
          lastRollsBeforeMods: this.state.dice.rawRolls.join(', '),
          lastTotal: this.state.dice.result,
        });
      } catch (e) {
        console.error(e);
        this.setState({
          error: e.message,
          lastRolls: null,
          lastRollsBeforeMods: null,
          lastTotal: null,
        });
      }
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
