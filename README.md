## About
Simple ScrollArea component built for [React](http://facebook.github.io/react/).

Demo: https://mishantrop.github.io/reactScrollareaDemo/
## Install

```bash
yarn add react-scrollarea
```
## Requirements
React Scrollarea requires React 0.15 or React 0.16

Features:
* built with and for React
* horizontal and vertical scrollbars
* touch support
* scrollbar dragging and clicking
* smooth scrolling
* universal app support
* customizable styles
* and more...

## Usage

### React 15-16
```js
import ScrollArea from 'react-scrollarea/src/js/ScrollAreaWithoutCss';
...
<ScrollArea
  className={'scrollarea'}
  contentClassName={'scrollarea-content'}
  smoothScrolling
  speed={0.8}
  verticalContainerClassName={'scrollbar-container'}
  verticalContainerClassNameActive={'scrollbar-container--active'}
  verticalContainerClassNameHorizontal={'scrollbar-container--horizontal'}
  verticalContainerClassNameVertical={'scrollbar-container--vertical'}
  verticalScrollbarClassName={'scrollbar'}
>
  Hello
</ScrollArea>
```

### Version without boundled css styles
If you prefer including scrollarea without css styles boundled inline to js file it's possible to import package without them. It's useful when you want to make custom css changes in scrollbars without using `!important` in each line.

```js
import ScrollArea from 'react-scrollarea/src/js/ScrollAreaWithoutCss';
```
Then **include css-file** file into your project.


### Run the example app

```bash
git clone https://github.com/mishantrop/reactScrollarea.git
cd reactScrollarea
yarn
gulp watch
```

then open [http://localhost:8003](http://localhost:8003).

### Using in universal app
`ScrollArea` component has now full universal app support. It's only one requirement: you have to use `react-scrollbar` in no-css version and then include css file into your project manually (see [this](#version-without-boundled-css-styles)). It's because of issue in webpack style-loader which is used to bundle css styles into main js file.

## API

### Props

```js
<ScrollArea
    className={String}
    contentClassName={String}
    contentStyle={Object}
    contentWindow={Object}
    focusableTabIndex={Number}
    horizontal={Boolean}
    horizontalContainerClassNameActive={String}
    horizontalContainerStyle={Object}
    horizontalSContainerClassName={String},
    horizontalScrollbarClassName={String},
    horizontalScrollbarStyle={Object}
    minScrollSize={Number}
    onScroll={(value) => {}}
    ownerDocument={Object}
    smoothScrolling={Boolean}
    speed={Number}
    stopScrollPropagation={Boolean}
    style={Object}
    swapWheelAxes={Boolean}
    vertical={Boolean}
    verticalContainerClassName={String}
    verticalContainerClassNameActive={String}
    verticalContainerStyle={Object}
    verticalScrollbarClassName={String}
    verticalScrollbarStyle={Object}
/>
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
