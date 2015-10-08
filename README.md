[![build status](https://img.shields.io/travis/souhe/reactScrollbar/master.svg?style=flat-square)](https://travis-ci.org/souhe/reactScrollbar)
[![npm package](https://img.shields.io/npm/v/react-scrollbar.svg?style=flat-square)](https://www.npmjs.org/package/react-scrollbar)

# react-scrollbar

Simple ScrollArea component built for [React](http://facebook.github.io/react/).

[Demo](http://souhe.github.io/reactScrollbar)

```bash
npm install react-scrollbar --save
```

React Scrollbar requires **React 0.13 or later**

## Usage examples

#### React 0.14
```js
    var React = require('react');
    var ReactDOM = require('react-dom');
    var ScrollArea = require('react-scrollbar');

    var App = React.createClass({
      render() {
        return (
          <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            >
            <div>Some long content.</div>
          </ScrollArea>
        );
      }
    });

    ReactDOM.render(<App/>, document.body);
```

#### React 0.13
For **React 0.13** you need to wrap ```<ScrollArea>``` child into a function.
```js
<ScrollArea>
    { () => <div>Some long content. </div> }
</ScrollArea>
```

### Run the example app

```bash
git clone https://github.com/souhe/reactScrollbar.git
cd reactScrollbar
npm install
gulp watch
```

then open [http://localhost:8003](http://localhost:80003).

## API

### Props

```js
    <ScrollArea
        speed={Number}
        className={String}
        contentClassName={String}
        horizontal={Boolean}
        vertical={Boolean}
    >
```

#### speed
Scroll speed applied to mouse wheel event.
**Default: 1**

#### className
CSS class names added to main scroll area component.

#### contentClassName
CSS class names added to element with scroll area content.

#### horizontal
When set to false, horizontal scrollbar will not be available.
**Default: true**

#### vertical
When set to false, vertical scrollbar will not be available, regardless of the content height.
**Default: true**

### Context
In context of each `<ScrollArea>` child could be injected an object `scrollArea` contains method:

#### `refresh()`
That method allows manual refreshing of the scrollbar.

```js
class App extends React.Component {
    render(){
        return (
            <ScrollArea>
                <Content />
            </ScrollArea>
        );
    }
}

class Content extends React.Component {
    render(){
        return (
            <div onClick={this.handleSomeAction.bind(this)}> Some long content </div>
        );
    }

    handleSomeAction(){
        this.context.scrollArea.refresh();
    }
}

Content.contextTypes = {
    scrollArea: React.PropTypes.object
};
```

## Change long
Every release is documented on the Github [Releases](https://github.com/souhe/reactScrollbar/releases) page.
