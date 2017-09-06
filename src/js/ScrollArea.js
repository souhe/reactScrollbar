import React from 'react';
import PropTypes from 'prop-types';
import ScrollBar from './Scrollbar';
import {findDOMNode, warnAboutFunctionChild, warnAboutElementChild, positiveOrZero, modifyObjValues} from './utils';
import lineHeight from 'line-height';
import {Motion, spring} from 'react-motion';

const eventTypes = {
    wheel: 'wheel',
    api: 'api',
    touch: 'touch',
    touchEnd: 'touchEnd',
    mousemove: 'mousemove',
    keyPress: 'keypress'
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
            containerWidth: 0
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
            }
        };

        this.evntsPreviousValues = {
            clientX: 0,
            clientY: 0,
            deltaX: 0,
            deltaY: 0
        };

        this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
    }

    getChildContext() {
        return {
            scrollArea: this.scrollArea
        };
    }

    componentDidMount() {
        if (this.props.contentWindow) {
            this.props.contentWindow.addEventListener("resize", this.bindedHandleWindowResize);
        }
        this.lineHeightPx = lineHeight(findDOMNode(this.content));
        this.setSizesToState();
    }

    componentWillUnmount() {
        if (this.props.contentWindow) {
            this.props.contentWindow.removeEventListener("resize", this.bindedHandleWindowResize);
        }
    }

    componentDidUpdate() {
        this.setSizesToState();
    }

    render() {
        let {children, className, contentClassName, ownerDocument} = this.props;
        let withMotion = this.props.smoothScrolling &&
            (this.state.eventType === eventTypes.wheel || this.state.eventType === eventTypes.api || this.state.eventType === eventTypes.touchEnd ||
            this.state.eventType === eventTypes.keyPress);

        let scrollbarY = this.canScrollY() ? (
            <ScrollBar
                containerClassName={this.props.verticalContainerClassName}
                containerClassNameActive={this.props.verticalContainerClassNameActive}
                containerClassNameHorizontal={this.props.verticalContainerClassNameHorizontal}
                containerClassNameVertical={this.props.verticalContainerClassNameVertical}
                containerSize={this.state.containerHeight}
                containerStyle={this.props.verticalContainerStyle}
                minScrollSize={this.props.minScrollSize}
                onFocus={this.focusContent.bind(this)}
                onMove={this.handleScrollbarMove.bind(this)}
                onPositionChange={this.handleScrollbarYPositionChange.bind(this)}
                ownerDocument={ownerDocument}
                position={this.state.topPosition}
                realSize={this.state.realHeight}
                scrollbarClassName={this.props.verticalScrollbarClassName}
                scrollbarStyle={this.props.verticalScrollbarStyle}
                smoothScrolling={withMotion}
                type="vertical"/>
        ) : null;

        let scrollbarX = this.canScrollX() ? (
            <ScrollBar
                containerClassName={this.props.horizontalContainerClassName}
                containerClassNameActive={this.props.horizontalContainerClassNameActive}
                containerClassNameHorizontal={this.props.horizontalContainerClassNameHorizontal}
                containerClassNameVertical={this.props.horizontalContainerClassNameVertical}
                containerSize={this.state.containerWidth}
                containerStyle={this.props.horizontalContainerStyle}
                minScrollSize={this.props.minScrollSize}
                onFocus={this.focusContent.bind(this)}
                onMove={this.handleScrollbarMove.bind(this)}
                onPositionChange={this.handleScrollbarXPositionChange.bind(this)}
                ownerDocument={ownerDocument}
                position={this.state.leftPosition}
                realSize={this.state.realWidth}
                scrollbarClassName={this.props.horizontalScrollbarClassName}
                scrollbarStyle={this.props.horizontalScrollbarStyle}
                smoothScrolling={withMotion}
                type="horizontal"/>
        ) : null;

        if (typeof children === 'function') {
            warnAboutFunctionChild();
            children = children();
        } else {
            warnAboutElementChild();
        }

        let classes = 'scrollarea ' + (className || '');
        let contentClasses = 'scrollarea-content ' + (contentClassName || '');

        let contentStyle = {
            marginTop: -this.state.topPosition,
            marginLeft: -this.state.leftPosition
        };
        let springifiedContentStyle = withMotion ? modifyObjValues(contentStyle, x => spring(x)) : contentStyle;

        return (
            <Motion style={springifiedContentStyle}>
                { style =>
                    <div
                        ref={x => this.wrapper = x}
                        className={classes}
                        style={this.props.style}
                        onWheel={this.handleWheel.bind(this)}
                    >
                        <div
                            ref={x => this.content = x}
                            style={{ ...this.props.contentStyle, ...style }}
                            className={contentClasses}
                            onTouchStart={this.handleTouchStart.bind(this)}
                            onTouchMove={this.handleTouchMove.bind(this)}
                            onTouchEnd={this.handleTouchEnd.bind(this)}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            tabIndex={this.props.focusableTabIndex}
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
        this.setState({...newState, eventType});
    }

    handleTouchStart(e) {
        let {touches} = e;
        if (touches.length === 1) {
            let {clientX, clientY} = touches[0];
            this.eventPreviousValues = {
                ...this.eventPreviousValues,
                clientY,
                clientX,
                timestamp: Date.now()
            };
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();

        let {touches} = e;
        if (touches.length === 1) {
            let {clientX, clientY} = touches[0];

            let deltaY = this.eventPreviousValues.clientY - clientY;
            let deltaX = this.eventPreviousValues.clientX - clientX;

            this.eventPreviousValues = {
                ...this.eventPreviousValues,
                deltaY,
                deltaX,
                clientY,
                clientX,
                timestamp: Date.now()
            };

            this.setStateFromEvent(this.composeNewState(-deltaX, -deltaY));
        }
    }

    handleTouchEnd(e) {
        let {deltaX, deltaY, timestamp} = this.eventPreviousValues;
        if (typeof deltaX === 'undefined') deltaX = 0;
        if (typeof deltaY === 'undefined') deltaY = 0;
        if (Date.now() - timestamp < 200) {
            this.setStateFromEvent(this.composeNewState(-deltaX * 10, -deltaY * 10), eventTypes.touchEnd);
        }

        this.eventPreviousValues = {
            ...this.eventPreviousValues,
            deltaY: 0,
            deltaX: 0
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
            deltaY = deltaY * this.lineHeightPx;
            deltaX = deltaX * this.lineHeightPx;
        }

        deltaY = deltaY * this.props.speed;
        deltaX = deltaX * this.props.speed;

        let newState = this.composeNewState(-deltaX, -deltaY);

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
            let lineHeight = this.lineHeightPx ? this.lineHeightPx : 10;

            switch (e.keyCode) {
                case 33: // page up
                    deltaY = this.state.containerHeight - lineHeight;
                    break;
                case 34: // page down
                    deltaY = -this.state.containerHeight + lineHeight;
                    break;
                case 37: // left
                    deltaX = lineHeight;
                    break;
                case 38: // up
                    deltaY = lineHeight;
                    break;
                case 39: // right
                    deltaX = -lineHeight;
                    break;
                case 40: // down
                    deltaY = -lineHeight;
                    break;
            }

            // only compose new state if key code matches those above
            if (deltaY !== 0 || deltaX !== 0) {
                let newState = this.composeNewState(deltaX, deltaY);

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
        let newState = this.computeSizes();

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
        let newTopPosition = this.state.topPosition - deltaY;
        return this.normalizeTopPosition(newTopPosition, sizes);
    }

    computeLeftPosition(deltaX, sizes) {
        let newLeftPosition = this.state.leftPosition - deltaX;
        return this.normalizeLeftPosition(newLeftPosition, sizes);
    }

    normalizeTopPosition(newTopPosition, sizes) {
        if (newTopPosition > sizes.realHeight - sizes.containerHeight) {
            newTopPosition = sizes.realHeight - sizes.containerHeight;
        }
        if (newTopPosition < 0) {
            newTopPosition = 0;
        }
        return newTopPosition;
    }

    normalizeLeftPosition(newLeftPosition, sizes) {
        if (newLeftPosition > sizes.realWidth - sizes.containerWidth) {
            newLeftPosition = sizes.realWidth - sizes.containerWidth;
        } else if (newLeftPosition < 0) {
            newLeftPosition = 0;
        }

        return newLeftPosition;
    }

    computeSizes() {
        let realHeight = (this.content) ? this.content.offsetHeight : 0;
        let containerHeight = (this.wrapper) ? this.wrapper.offsetHeight : 0;
        let realWidth = (this.content) ? this.content.offsetWidth : 0;
        let containerWidth = (this.wrapper) ? this.wrapper.offsetWidth : 0;

        return {
            realHeight: realHeight,
            containerHeight: containerHeight,
            realWidth: realWidth,
            containerWidth: containerWidth
        };
    }

    setSizesToState() {
        let sizes = this.computeSizes();
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
            let position = this.normalizeTopPosition(topPosition, this.computeSizes());
            this.setStateFromEvent({topPosition: position}, eventTypes.api);
        }
    }

    scrollXTo(leftPosition) {
        if (this.canScrollX()) {
            let position = this.normalizeLeftPosition(leftPosition, this.computeSizes());
            this.setStateFromEvent({leftPosition: position}, eventTypes.api);
        }
    }

    canScrollY(state = this.state) {
        let scrollableY = state.realHeight > state.containerHeight;
        return scrollableY && this.props.vertical;
    }

    canScrollX(state = this.state) {
        let scrollableX = state.realWidth > state.containerWidth;
        return scrollableX && this.props.horizontal;
    }

    getModifiedPositionsIfNeeded(newState) {
        let bottomPosition = newState.realHeight - newState.containerHeight;
        if (this.state.topPosition >= bottomPosition) {
            newState.topPosition = this.canScrollY(newState) ? positiveOrZero(bottomPosition) : 0;
        }

        let rightPosition = newState.realWidth - newState.containerWidth;
        if (this.state.leftPosition >= rightPosition) {
            newState.leftPosition = this.canScrollX(newState) ? positiveOrZero(rightPosition) : 0;
        }

        return newState;
    }

    focusContent() {
        if(this.content) {
            findDOMNode(this.content).focus();
        }
    }
}

ScrollArea.childContextTypes = {
    scrollArea: PropTypes.object
};

ScrollArea.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    contentWindow: PropTypes.any,
    focusableTabIndex: PropTypes.number,
    horizontal: PropTypes.bool,
    horizontalContainerClassNameActive: PropTypes.string,
    horizontalContainerStyle: PropTypes.object,
    horizontalSContainerClassName: PropTypes.string,
    horizontalScrollbarClassName: PropTypes.string,
    horizontalScrollbarStyle: PropTypes.object,
    minScrollSize: PropTypes.number,
    onScroll: PropTypes.func,
    ownerDocument: PropTypes.any,
    smoothScrolling: PropTypes.bool,
    speed: PropTypes.number,
    stopScrollPropagation: PropTypes.bool,
    style: PropTypes.object,
    swapWheelAxes: PropTypes.bool,
    vertical: PropTypes.bool,
    verticalContainerClassName: PropTypes.string,
    verticalContainerClassNameActive: PropTypes.string,
    verticalContainerStyle: PropTypes.object,
    verticalScrollbarClassName: PropTypes.string,
    verticalScrollbarStyle: PropTypes.object,
};

ScrollArea.defaultProps = {
    contentWindow: (typeof window === "object") ? window : undefined,
    focusableTabIndex: 1,
    horizontal: true,
    ownerDocument: (typeof document === "object") ? document : undefined,
    smoothScrolling: false,
    speed: 1,
    swapWheelAxes: false,
    vertical: true,
};
