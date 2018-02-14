
[![build status](https://img.shields.io/travis/souhe/reactScrollbar/master.svg?style=flat-square)](https://travis-ci.org/souhe/reactScrollbar)
[![npm package](https://img.shields.io/npm/v/react-scrollbar.svg?style=flat-square)](https://www.npmjs.org/package/react-scrollbar)
[![npm downloads](https://img.shields.io/npm/dm/react-scrollbar.svg?style=flat-square)](https://www.npmjs.org/package/react-scrollbar)
# react-scrollbar

Simple ScrollArea component built for [React](http://facebook.github.io/react/).

[Demo](http://souhe.github.io/reactScrollbar)

```bash
npm install react-scrollbar --save
```

React Scrollbar requires **React 0.13 or later**

Features:
 - built with and for `React`
 - horizontal and vertical scrollbars
 - touch support
 - scrollbar dragging and clicking
 - smooth scrolling
 - universal app support
 - customizable styles
 - and more...

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

#### Version without boundled css styles ####
If you prefer including scrollbar without css styles boundled inline to js file it's possible to import package without them. It's useful when you want to make custom css changes in scrollbars without using `!important` in each line. 

```js
    var ScrollArea = require('react-scrollbar/no-css');
```
Then **include scrollArea.css** file into your project.


### Run the example app

```bash
git clone https://github.com/souhe/reactScrollbar.git
cd reactScrollbar
npm install
gulp build-examples
gulp less-examples
gulp watch
```

then open [http://localhost:8003](http://localhost:8003).

### Using in universal app
`ScrollArea` component has now full universal app support. It's only one requirement: you have to use `react-scrollbar` in no-css version and then include css file into your project manually (see [this](#version-without-boundled-css-styles)). It's because of issue in webpack style-loader which is used to bundle css styles into main js file.

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
        onScroll={(value) => {}}
        contentWindow={Object}
        ownerDocument={Object}
        smoothScrolling={Boolean}
        minScrollSize={Number}
        swapWheelAxes={Boolean}
        stopScrollPropagation={Boolean}
        focusableTabIndex={Number}
    >
```

#### speed
Scroll speed applied to mouse wheel event.
**Default: 1**

#### onScroll
`onScroll(value: Object)` event which can notify the parent component when the container scrolls.
- `value: Object` - informations about current position
 - `value.leftPosition: Number` - content left position (distance in pixels from the left side of container)
 - `value.topPosition: Number` - content top position (distance in pixels from the top of container)
 - `value.containerHeight: Number` - container height
 - `value.containerWidth: Number` - container width
 - `value.realHeight: Number` - real content height
 - `value.realWidth: Number` - real content width

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

#### contentWindow
You can override window to make scrollarea works inside iframe.
**Default: window**

#### ownerDocument
You can override document to make scrollarea works inside iframe.
**Default: document**

#### smoothScrolling
When set to true, smooth scrolling for both scrollbars is enabled. 
**Default: false**

#### minScrollSize
Using this prop it's possible to set minimal size in px for both scrollbars.

#### swapWheelAxes
After set to true, mouse wheel event has swapped directions. So normal scrolling moves horizontal scrollbar and scrolling with SHIFT key moves vertical scrollbar. It could be useful for applications with horizontal layout.
**Default: false**

#### stopScrollPropagation
After set to true, mouse wheel event will not propagate. This option is specifically useful in preventing nested scroll areas from propagating scroll actions to parent scroll areas.
**Default: false**

#### focusableTabIndex
After set to a number, scrollarea-content is rendered with a tabindex value set to the passed in. This option is specifically useful in allowing the scroll area to be focusable.
**Default: undefined**


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

#### `scrollYTo(topPosition)`
It moves vertical scrollbar. `topPosition` is a distance between the top of `scrollArea` container and the top of `scrollArea` content.  

#### `scrollLeft()`
It allows to scroll to the left of `ScrollArea` component.

#### `scrollRight()`
It allows to scroll to the right of `ScrollArea` component.

#### `scrollXTo(leftPosition)`
It moves horizontal scrollbar. `leftPosition` is a distance between left edge of `scrollArea` container and left edge of `scrollArea` content.  

# Change log
Every release is documented on the Github [Releases](https://github.com/souhe/reactScrollbar/releases) page. 

# License
MIT
