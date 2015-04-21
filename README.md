# react-scrollbar

Simple ScrollArea component built for [React](facebook.github.io/react/).

```bash
npm install react-scrollbar --save
```

## Usage examples

```js
    var React = reqire('react');
    var ScrollArea = require('react-scrollbar');

    var App = React.createClass({
      render() {
        return (
          <ScrollArea
            speed={0.8}
            >
            Some long content.
          </ScrollArea>
        );
      }
    });

    React.render(<App/>, document.body);
```

### Run the example app

```bash
git clone https://github.com/souhe/reactScrollbar.git
cd reactScrollbar
npm install
gulp
```

then open [http://localhost:8003](http://localhost:80003).

## API

### Props

```js
    <ScrollArea
        speed={Number}
    >
```

Default speed value is 1.
