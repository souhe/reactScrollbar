import React from 'react';
import lineHeight from 'line-height';
import { Motion, spring } from 'react-motion';

import ScrollBar from './Scrollbar';
import { findDOMNode, warnAboutFunctionChild, warnAboutElementChild, positiveOrZero, modifyObjValues } from './utils';

const eventTypes = {
  wheel: 'wheel',
  api: 'api',
  touch: 'touch',
  touchEnd: 'touchEnd',
  mousemove: 'mousemove',
  keyPress: 'keypress',
};

export default class ScrollArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topPosition: 0,
      leftPosition: 0,
      realHeight: 0,
      containerHeight: 0,
      realWidth: 0,
      containerWidth: 0,
    };

    this.scrollArea = {
      refresh: () => {
        this.setSizesToState();
      },
      scrollTop: () => {
        this.scrollTop();
      },
      scrollBottom: () => {
        this.scrollBottom();
      },
      scrollYTo: (position) => {
        this.scrollYTo(position);
      },
      scrollLeft: () => {
        this.scrollLeft();
      },
      scrollRight: () => {
        this.scrollRight();
      },
      scrollXTo: (position) => {
        this.scrollXTo(position);
      },
    };

    this.evntsPreviousValues = {
      clientX: 0,
      clientY: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
  }

  getChildContext() {
    return {
      scrollArea: this.scrollArea,
    };
  }

  componentDidMount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.addEventListener('resize', this.bindedHandleWindowResize);
    }
    this.lineHeightPx = lineHeight(findDOMNode(this.content));
    this.setSizesToState();
  }

  componentDidUpdate() {
    this.setSizesToState();
  }

  componentWillUnmount() {
    if (this.props.contentWindow) {
      this.props.contentWindow.removeEventListener('resize', this.bindedHandleWindowResize);
    }
  }

  render() {
    const { className, contentClassName, ownerDocument } = this.props;
    let { children } = this.props;

    const withMotion = this.props.smoothScrolling && (
      this.state.eventType === eventTypes.wheel ||
      this.state.eventType === eventTypes.api ||
      this.state.eventType === eventTypes.touchEnd ||
      this.state.eventType === eventTypes.keyPress
    );

    const scrollbarY = this.canScrollY() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realHeight}
        containerSize={this.state.containerHeight}
        position={this.state.topPosition}
        onMove={this.handleScrollbarMove.bind(this)}
        onPositionChange={this.handleScrollbarYPositionChange.bind(this)}
        containerStyle={this.props.verticalContainerStyle}
        scrollbarStyle={this.props.verticalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        onFocus={this.focusContent.bind(this)}
        type="vertical"
      />
    ) : null;

    const scrollbarX = this.canScrollX() ? (
      <ScrollBar
        ownerDocument={ownerDocument}
        realSize={this.state.realWidth}
        containerSize={this.state.containerWidth}
        position={this.state.leftPosition}
        onMove={this.handleScrollbarMove.bind(this)}
        onPositionChange={this.handleScrollbarXPositionChange.bind(this)}
        containerStyle={this.props.horizontalContainerStyle}
        scrollbarStyle={this.props.horizontalScrollbarStyle}
        smoothScrolling={withMotion}
        minScrollSize={this.props.minScrollSize}
        onFocus={this.focusContent.bind(this)}
        type="horizontal"
      />
    ) : null;

    if (typeof children === 'function') {
      warnAboutFunctionChild();
      children = children();
    } else {
      warnAboutElementChild();
    }

    const classes = `scrollarea ${className || ''}`;
    const contentClasses = `scrollarea-content ${contentClassName || ''}`;

    const contentStyle = {
      marginTop: -this.state.topPosition,
      marginLeft: -this.state.leftPosition,
    };
    const springifiedContentStyle = withMotion ?
      modifyObjValues(contentStyle, x => spring(x)) :
      contentStyle;

    const tabIndexProp = this.props.focusableTabIndex ?
      { tabIndex: this.props.focusableTabIndex } : {};

    return (
      <Motion style={{ ...this.props.contentStyle, ...springifiedContentStyle }}>
        {style =>
          <div
            ref={x => (this.wrapper = x)}
            style={this.props.style}
            className={classes}
            onWheel={this.handleWheel.bind(this)}
          >
            <div
              ref={x => (this.content = x)}
              style={style}
              className={contentClasses}
              onTouchStart={this.handleTouchStart.bind(this)}
              onTouchMove={this.handleTouchMove.bind(this)}
              onTouchEnd={this.handleTouchEnd.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
              {...tabIndexProp}
            >
              {children}
            </div>
            {scrollbarY}
            {scrollbarX}
          </div>
        }
      </Motion>
    );
  }

  setStateFromEvent(newState, eventType) {
    if (this.props.onScroll) {
      this.props.onScroll(newState);
    }
    this.setState({ ...newState, eventType });
  }

  handleTouchStart(e) {
    const { touches } = e;
    if (touches.length === 1) {
      const { clientX, clientY } = touches[0];
      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        clientY,
        clientX,
        timestamp: Date.now(),
      };
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();

    const { touches } = e;
    if (touches.length === 1) {
      const { clientX, clientY } = touches[0];

      const deltaY = this.eventPreviousValues.clientY - clientY;
      const deltaX = this.eventPreviousValues.clientX - clientX;

      this.eventPreviousValues = {
        ...this.eventPreviousValues,
        deltaY,
        deltaX,
        clientY,
        clientX,
        timestamp: Date.now(),
      };

      this.setStateFromEvent(this.composeNewState(-deltaX, -deltaY));
    }
  }

  handleTouchEnd() {
    let { deltaX, deltaY } = this.eventPreviousValues;
    if (typeof deltaX === 'undefined') deltaX = 0;
    if (typeof deltaY === 'undefined') deltaY = 0;
    if (Date.now() - this.eventPreviousValues.timestamp < 200) {
      this.setStateFromEvent(this.composeNewState(-deltaX * 10, -deltaY * 10), eventTypes.touchEnd);
    }

    this.eventPreviousValues = {
      ...this.eventPreviousValues,
      deltaY: 0,
      deltaX: 0,
    };
  }

  handleScrollbarMove(deltaY, deltaX) {
    this.setStateFromEvent(this.composeNewState(deltaX, deltaY));
  }

  handleScrollbarXPositionChange(position) {
    this.scrollXTo(position);
  }

  handleScrollbarYPositionChange(position) {
    this.scrollYTo(position);
  }

  handleWheel(e) {
    let deltaY = e.deltaY;
    let deltaX = e.deltaX;

    if (this.props.swapWheelAxes) {
      [deltaY, deltaX] = [deltaX, deltaY];
    }

    /*
    * WheelEvent.deltaMode can differ between browsers and must be normalized
    * e.deltaMode === 0: The delta values are specified in pixels
    * e.deltaMode === 1: The delta values are specified in lines
    * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
    */
    if (e.deltaMode === 1) {
      deltaY *= this.lineHeightPx;
      deltaX *= this.lineHeightPx;
    }

    deltaY *= this.props.speed;
    deltaX *= this.props.speed;

    const newState = this.composeNewState(-deltaX, -deltaY);

    if ((newState.topPosition && this.state.topPosition !== newState.topPosition) ||
      (newState.leftPosition && this.state.leftPosition !== newState.leftPosition) ||
      this.props.stopScrollPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setStateFromEvent(newState, eventTypes.wheel);
    this.focusContent();
  }

  handleKeyDown(e) {
    // only handle if scroll area is in focus
    if (e.target.tagName.toLowerCase() !== 'input') {
      let deltaY = 0;
      let deltaX = 0;
      const height = this.lineHeightPx ? this.lineHeightPx : 10;

      switch (e.keyCode) {
        case 33: // page up
          deltaY = this.state.containerHeight - height;
          break;
        case 34: // page down
          deltaY = -this.state.containerHeight + height;
          break;
        case 37: // left
          deltaX = height;
          break;
        case 38: // up
          deltaY = height;
          break;
        case 39: // right
          deltaX = -height;
          break;
        case 40: // down
          deltaY = -height;
          break;
      }

      // only compose new state if key code matches those above
      if (deltaY !== 0 || deltaX !== 0) {
        const newState = this.composeNewState(deltaX, deltaY);

        e.preventDefault();
        e.stopPropagation();

        this.setStateFromEvent(newState, eventTypes.keyPress);
      }
    }
  }

  handleWindowResize() {
    let newState = this.computeSizes();
    newState = this.getModifiedPositionsIfNeeded(newState);
    this.setStateFromEvent(newState);
  }

  composeNewState(deltaX, deltaY) {
    const newState = this.computeSizes();

    if (this.canScrollY(newState)) {
      newState.topPosition = this.computeTopPosition(deltaY, newState);
    } else {
      newState.topPosition = 0;
    }
    if (this.canScrollX(newState)) {
      newState.leftPosition = this.computeLeftPosition(deltaX, newState);
    }

    return newState;
  }

  computeTopPosition(deltaY, sizes) {
    const newTopPosition = this.state.topPosition - deltaY;
    return this.normalizeTopPosition(newTopPosition, sizes);
  }

  computeLeftPosition(deltaX, sizes) {
    const newLeftPosition = this.state.leftPosition - deltaX;
    return this.normalizeLeftPosition(newLeftPosition, sizes);
  }

  normalizeTopPosition(newTopPosition, sizes) {
    let normalizedTopPosition = newTopPosition;
    if (newTopPosition > sizes.realHeight - sizes.containerHeight) {
      normalizedTopPosition = sizes.realHeight - sizes.containerHeight;
    }
    if (normalizedTopPosition < 0) {
      normalizedTopPosition = 0;
    }
    return normalizedTopPosition;
  }

  normalizeLeftPosition(newLeftPosition, sizes) {
    let normalizedLeftPosition = newLeftPosition;
    if (newLeftPosition > sizes.realWidth - sizes.containerWidth) {
      normalizedLeftPosition = sizes.realWidth - sizes.containerWidth;
    } else if (newLeftPosition < 0) {
      normalizedLeftPosition = 0;
    }

    return normalizedLeftPosition;
  }

  computeSizes() {
    const realHeight = this.content.offsetHeight;
    const containerHeight = this.wrapper.offsetHeight;
    const realWidth = this.content.offsetWidth;
    const containerWidth = this.wrapper.offsetWidth;

    return {
      realHeight,
      containerHeight,
      realWidth,
      containerWidth,
    };
  }

  setSizesToState() {
    const sizes = this.computeSizes();
    if (sizes.realHeight !== this.state.realHeight || sizes.realWidth !== this.state.realWidth) {
      this.setStateFromEvent(this.getModifiedPositionsIfNeeded(sizes));
    }
  }

  scrollTop() {
    this.scrollYTo(0);
  }

  scrollBottom() {
    this.scrollYTo((this.state.realHeight - this.state.containerHeight));
  }

  scrollLeft() {
    this.scrollXTo(0);
  }

  scrollRight() {
    this.scrollXTo((this.state.realWidth - this.state.containerWidth));
  }

  scrollYTo(topPosition) {
    if (this.canScrollY()) {
      const position = this.normalizeTopPosition(topPosition, this.computeSizes());
      this.setStateFromEvent({ topPosition: position }, eventTypes.api);
    }
  }

  scrollXTo(leftPosition) {
    if (this.canScrollX()) {
      const position = this.normalizeLeftPosition(leftPosition, this.computeSizes());
      this.setStateFromEvent({ leftPosition: position }, eventTypes.api);
    }
  }

  canScrollY(state = this.state) {
    const scrollableY = state.realHeight > state.containerHeight;
    return scrollableY && this.props.vertical;
  }

  canScrollX(state = this.state) {
    const scrollableX = state.realWidth > state.containerWidth;
    return scrollableX && this.props.horizontal;
  }

  getModifiedPositionsIfNeeded(newState) {
    const bottomPosition = newState.realHeight - newState.containerHeight;
    const state = { ...newState };
    if (this.state.topPosition >= bottomPosition) {
      state.topPosition = this.canScrollY(newState) ? positiveOrZero(bottomPosition) : 0;
    }

    const rightPosition = newState.realWidth - newState.containerWidth;
    if (this.state.leftPosition >= rightPosition) {
      state.leftPosition = this.canScrollX(newState) ? positiveOrZero(rightPosition) : 0;
    }

    return state;
  }

  focusContent() {
    if (this.content) {
      findDOMNode(this.content).focus();
    }
  }
}

ScrollArea.childContextTypes = {
  scrollArea: React.PropTypes.object,
};

ScrollArea.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.func,
  ]),
  className: React.PropTypes.string,
  style: React.PropTypes.object,
  speed: React.PropTypes.number,
  contentClassName: React.PropTypes.string,
  contentStyle: React.PropTypes.object,
  vertical: React.PropTypes.bool,
  verticalContainerStyle: React.PropTypes.object,
  verticalScrollbarStyle: React.PropTypes.object,
  horizontal: React.PropTypes.bool,
  horizontalContainerStyle: React.PropTypes.object,
  horizontalScrollbarStyle: React.PropTypes.object,
  onScroll: React.PropTypes.func,
  contentWindow: React.PropTypes.any,
  ownerDocument: React.PropTypes.any,
  smoothScrolling: React.PropTypes.bool,
  minScrollSize: React.PropTypes.number,
  swapWheelAxes: React.PropTypes.bool,
  stopScrollPropagation: React.PropTypes.bool,
  focusableTabIndex: React.PropTypes.number,
};

ScrollArea.defaultProps = {
  speed: 1,
  vertical: true,
  horizontal: true,
  smoothScrolling: false,
  swapWheelAxes: false,
  contentWindow: (typeof window === 'object') ? window : undefined,
  ownerDocument: (typeof document === 'object') ? document : undefined,
};
