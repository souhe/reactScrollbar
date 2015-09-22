[![build status](https://img.shields.io/travis/souhe/reactScrollbar/master.svg?style=flat-square)](https://travis-ci.org/souhe/reactScrollbar)
[![npm package](https://img.shields.io/npm/v/react-scrollbar.svg?style=flat-square)](https://www.npmjs.org/package/react-scrollbar)

# react-scrollbar

Simple ScrollArea component built for [React](http://facebook.github.io/react/).

[Demo](http://souhe.github.io/reactScrollbar)

```bash
npm install react-scrollbar --save
```

## Usage examples

```js
    var React = require('react');
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
            Some long content.
          </ScrollArea>
        );
      }
    });

    React.render(<App/>, document.body);
```

Then **include scrollbar.css** file into your project.

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
