import { Dice } from '../../src/index';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IAppState {
  dice: Dice;
  error: string;
  lastResult: number;
  rolls: number[];
}

class App extends React.Component<any, IAppState> {
  public constructor(props, context) {
    super(props, context);

    this.state = {
      dice: new Dice(),
      error: null,
      lastResult: null,
      rolls: [],
    };
  }

  public render() {
    let diceBreakdown;

    if (this.state.dice !== null) {
      diceBreakdown = (
        <div>
          <code style={{ paddingLeft: 2 }}>{this.state.dice.toString()}</code>
          <p>{this.state.dice.toStringPlaintext()}</p>
        </div>
      );
    }

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
        <div>{this.state.error}</div>
        <div>{diceBreakdown}</div>
        <div><h3>{this.state.lastResult}</h3><code>[{this.state.rolls.join()}]</code></div>
      </div>
    );
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const newDice = new Dice(event.target.value);
      this.setState({
        dice: newDice,
        error: null,
      });
    } catch (e) {
      console.error(e);
      this.setState({
        dice: null,
        error: e.message,
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
      this.state.dice.roll();
      try {
        this.setState({
          error: null,
          lastResult: this.state.dice.result,
          rolls: this.state.dice.rolls,
        });
      } catch (e) {
        console.error(e);
        this.setState({
          error: e.message,
          lastResult: null,
          rolls: null,
        });
      }
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
