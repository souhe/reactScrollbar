[![build status](https://travis-ci.org/souhe/reactScrollbar.svg?branch=master)](https://travis-ci.org/souhe/reactScrollbar)
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
For **React 0.13** you need to wrap `<ScrollArea>` child into a function.
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
        style={Object}
        contentClassName={String}
        contentStyle={Object}
        horizontal={Boolean}
        horizontalContainerStyle={Object}
        horizontalScrollbarStyle={Object}
        vertical={Boolean}
        verticalContainerStyle={Object}
        verticalScrollbarStyle={Object}
    >
```

#### speed
Scroll speed applied to mouse wheel event.
**Default: 1**

#### className
CSS class names added to main scroll area component.

#### style
Inline styles applied to the main scroll area component.

#### contentClassName
CSS class names added to element with scroll area content.

#### contentStyle
Inline styles applied to element with scroll area content.

#### horizontal
When set to false, horizontal scrollbar will not be available.
**Default: true**

#### horizontalContainerStyle
Inline styles applied to horizontal scrollbar's container.

#### horizontalScrollbarStyle
Inline styles applied to horizontal scrollbar.

#### vertical
When set to false, vertical scrollbar will not be available, regardless of the content height.
**Default: true**

#### verticalContainerStyle
Inline styles applied to vertical scrollbar's container.

#### verticalScrollbarStyle
Inline styles applied to vertical scrollbar.

### Context
In context of each `<ScrollArea>` child could be injected an object `scrollArea` contains method:

#### `refresh()`
That method allows manual refreshing of the scrollbar.

React 0.14 example using ES6 syntax:
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

#### `scrollTop()`
It allows to scroll to the top of `ScrollArea` component.

#### `scrollBottom()`
It allows to scroll to the bottom of `ScrollArea` component.

#### `scrollXTo(topPosition)`
It moves vertical scrollbar to `topPosition`. 

#### `scrollLeft()`
It allows to scroll to the left of `ScrollArea` component.

#### `scrollRight()`
It allows to scroll to the right of `ScrollArea` component.

#### `scrollYTo(leftPosition)`
It moves horizontal scrollbar to `leftPosition`. 

# Change log
Every release is documented on the Github [Releases](https://github.com/souhe/reactScrollbar/releases) page. 

## v0.3.0
- ### New `context` methods:
 - `scrollTop()` - 
 It allows to scroll to the top of `ScrollArea` component.
 - `scrollBottom()` - 
 It allows to scroll to the bottom of `ScrollArea` component.
 -  `scrollXTo(topPosition)`  - 
 It moves vertical scrollbar to `topPosition`. 
 -  `scrollLeft()`  - 
 It allows to scroll to the left of `ScrollArea` component.
 -  `scrollRight()` - 
 It allows to scroll to the right of `ScrollArea` component.
 -  `scrollYTo(leftPosition)` - 
 It moves horizontal scrollbar to `leftPosition`.
  
- ### Bug fixes
 -  fixed browserify support
  

## v0.2.2
- ### New props for inline styles:
 - `style` - Inline styles applied to the main scroll area component.
 - `contentStyle` - Inline styles applied to element with scroll area content
 - `horizontalContainerStyle` - Inline styles applied to horizontal scrollbar's container
 - `horizontalScrollbarStyle` - Inline styles applied to horizontal scrollbar
 - `verticalContainerStyle` - Inline styles applied to vertical scrollbar's container
 - `verticalScrollbarStyle` - Inline styles applied to vertical scrollbar
 
## v0.2.0
- #### `Refresh()` method
To each <ScrollArea> child could be injected an object `scrollArea` contains method `refresh()` which could refresh react scrollbar state.
When using **React 0.13** it's necessary to wrap `<ScrollArea>` child into a function. This is a temporary workaround for a React 0.13 context issue, which is fixed in React 0.14.

- #### Touch support
Now React Scrollbar supports touch events.

- #### React 0.14 support

- #### No need to include `css` styles to project anymore.
Styles are now boundled together with scripts.
