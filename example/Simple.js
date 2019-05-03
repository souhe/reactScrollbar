import React from 'react';
// eslint-disable-next-line import/no-unresolved
import ScrollArea from '../src/js/ScrollArea';
import { css } from 'linaria';

class SimpleExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsCount: 40,
    };
  }

  handleScroll(scrollData) {
    // eslint-disable-next-line no-console
    console.log(scrollData);
  }

  render() {
    var itemElements = [];

    for (var i = 0; i < this.state.itemsCount; i++) {
      itemElements.push(
        <div className={item} key={i}>
          item {i}
        </div>
      );
    }

    let scrollbarStyles = { borderRadius: 5 };

    return (
      <div>
        <ScrollArea
          className={area}
          contentClassName={content}
          verticalScrollbarStyle={scrollbarStyles}
          verticalContainerStyle={scrollbarStyles}
          horizontalScrollbarStyle={scrollbarStyles}
          horizontalContainerStyle={scrollbarStyles}
          smoothScrolling={true}
          minScrollSize={40}
          onScroll={this.handleScroll}
        >
          {itemElements}
        </ScrollArea>
      </div>
    );
  }
}

export const area = css`
  margin: 0 auto;
  width: 300px;
  height: 300px;
  background: #e5e5e5;

  ul {
    width: 700px;
  }
`;

export const content = css`
  width: 400px;
`;

export const item = css`
  background: #82bb95;
  width: 180px;
  height: 70px;
  margin: 10px;
  float: left;
  padding: 8px;
  box-sizing: border-box;
`;

export default SimpleExample;
