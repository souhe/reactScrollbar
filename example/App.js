import * as React from 'react';
import { css } from 'linaria';

import ChangingChildren from './ChangingChildren';
import Simple from './Simple';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'basic',
    };
  }

  switchExample(event) {
    this.setState({ selected: event.target.value });
  }

  render() {
    return (
      <div>
        <div className={selector}>
          <div>Example:</div>
          <select
            value={this.state.selected}
            onChange={this.switchExample.bind(this)}
          >
            <option value="basic">Basic</option>
            <option value="changing-children">Changing Children</option>
          </select>
        </div>
        {(() => {
          if (this.state.selected === 'changing-children') {
            return <ChangingChildren />;
          } else {
            return <Simple />;
          }
        })()}
      </div>
    );
  }
}

const selector = css`
  padding-bottom: 50px;
  text-align: center;
`;
export default App;
