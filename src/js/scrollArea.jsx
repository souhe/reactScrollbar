import '../less/scrollbar.less';
import React from 'react';
import Scrollbar from './scrollBar';
import {findDOMNode, warnAboutFunctionChild, warnAboutElementChild, positiveOrZero} from './utils';
import lineHeight from 'line-height';
import {Motion, spring} from 'react-motion';

export default class ScrollArea extends React.Component{
    constructor(props){
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
        }

        this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
    }

    getChildContext(){
        return {
            scrollArea: this.scrollArea
        };
    }

    componentDidMount(){
        window.addEventListener("resize", this.bindedHandleWindowResize);
        this.lineHeightPx = 10;//lineHeight(findDOMNode(this.refs.content));
        this.setSizesToState();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.bindedHandleWindowResize);
    }

    componentDidUpdate(){
        this.setSizesToState();
    }

    render(){
        let {children, className, contentClassName} = this.props
        // let contentStyle = {
        //     // marginTop: this.state.topPosition,
        //     // marginLeft: this.state.leftPosition,
        //     transform: `translate(${ this.state.leftPosition }px, ${ this.state.topPosition }px)`
        // };

        var scrollbarY = this.canScrollY()? (
            <Scrollbar
                realSize={this.state.realHeight}
                containerSize={this.state.containerHeight}
                position={-this.state.topPosition}
                onMove={this.handleMove.bind(this)}
                containerStyle={this.props.verticalContainerStyle}
                scrollbarStyle={this.props.verticalScrollbarStyle}
                type="vertical"/>
        ): null;

        var scrollbarX = this.canScrollX()? (
            <Scrollbar
                realSize={this.state.realWidth}
                containerSize={this.state.containerWidth}
                position={-this.state.leftPosition}
                onMove={this.handleMove.bind(this)}
                containerStyle={this.props.horizontalContainerStyle}
                scrollbarStyle={this.props.horizontalScrollbarStyle}
                type="horizontal"/>
        ): null;

        if(typeof children === 'function'){
            warnAboutFunctionChild();
            children = children();
        } else {
            warnAboutElementChild();
        }

        var classes = 'scrollarea ' + (className || '');
        var contentClasses = 'scrollarea-content ' + (contentClassName || '');
        
        let contentStyle = {
            marginTop: spring(this.state.topPosition),
            marginLeft: spring(this.state.leftPosition),
            ...contentStyle
        };
        return (
            <Motion style={contentStyle}>
                { style => 
                    <div ref={x => this.wrapper = x} style={this.props.style} className={classes} onWheel={this.handleWheel.bind(this)}>
                        <div ref={x => this.content = x}
                            style={style}
                            className={contentClasses}
                            onTouchStart={this.handleTouchStart.bind(this)}
                            onTouchMove={this.handleTouchMove.bind(this)}>
                            {children}
                        </div>
                        {scrollbarY}
                        {scrollbarX}
                    </div>
                }
            </Motion>
        );
    }

    handleTouchStart(e){
        let {touches} = e;
        if(touches.length === 1){
            let {clientX, clientY} = touches[0];
            this.setState({ lastClientYPosition: clientY, lastClientXPosition: clientX });
        }
    }

    handleTouchMove(e){
        e.preventDefault();
        let {touches} = e;
        if(touches.length === 1){
            let {clientX, clientY} = touches[0];

            let deltaY = this.state.lastClientYPosition - clientY;
            let deltaX = this.state.lastClientXPosition - clientX;
            this.handleMove(-deltaY, -deltaX);
            this.setState({ lastClientYPosition: clientY, lastClientXPosition: clientX });
        }
    }

    handleMove(deltaY, deltaX){
        var newState = this.computeSizes();
        if(this.canScrollY(newState)){
            newState.topPosition = this.computeTopPosition(deltaY, newState);
        }
        if(this.canScrollX(newState)){
            newState.leftPosition = this.computeLeftPosition(deltaX, newState);
        }
        this.setState(newState);
    }

    handleWheel(e){
        var newState = this.computeSizes();
        var deltaY = e.deltaY;
        var deltaX = e.deltaX;

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

        if(this.canScrollY(newState)){
            newState.topPosition = this.computeTopPosition(-deltaY, newState);
        }

        if(this.canScrollX(newState)){
            newState.leftPosition = this.computeLeftPosition(-deltaX, newState);
        }

        if(this.state.topPosition !== newState.topPosition || this.state.leftPosition !== newState.leftPosition){
            e.preventDefault();
        }

        this.setState(newState);
    }

    computeTopPosition(deltaY, sizes){
        var newTopPosition = this.state.topPosition + deltaY;
        return this.normalizeTopPosition(newTopPosition, sizes);
    }

    computeLeftPosition(deltaX, sizes){
        var newLeftPosition = this.state.leftPosition + deltaX;
        return this.normalizeLeftPosition(newLeftPosition, sizes);
    }
    
    normalizeTopPosition(newTopPosition, sizes){    
        if(-newTopPosition > sizes.realHeight - sizes.containerHeight){
            newTopPosition = -(sizes.realHeight - sizes.containerHeight);
        }
        if(newTopPosition > 0){
            newTopPosition = 0;
        }
        return newTopPosition;
    }
    
    normalizeLeftPosition(newLeftPosition, sizes){
        if(-newLeftPosition > sizes.realWidth - sizes.containerWidth){
            newLeftPosition = -(sizes.realWidth - sizes.containerWidth);
        } else if(newLeftPosition > 0){
            newLeftPosition = 0;
        }

        return newLeftPosition;
    }

    handleWindowResize(){
        var newState = this.computeSizes();
        newState = this.getModifiedPositionsIfNeeded(newState);
        this.setState(newState);
    }

    computeSizes(){
        var realHeight = findDOMNode(this.content).offsetHeight;
        var containerHeight = findDOMNode(this.wrapper).offsetHeight;
        var realWidth = findDOMNode(this.content).offsetWidth;
        var containerWidth = findDOMNode(this.wrapper).offsetWidth;

        return {
            realHeight: realHeight,
            containerHeight: containerHeight,
            realWidth: realWidth,
            containerWidth: containerWidth
        };
    }

    setSizesToState(){
        var sizes = this.computeSizes();
        if(sizes.realHeight !== this.state.realHeight || sizes.realWidth !== this.state.realWidth){
            this.setState(this.getModifiedPositionsIfNeeded(sizes));
        }
    }

    scrollTop(){
        this.setState({topPosition: 0});
    }

    scrollBottom(){
        this.setState({topPosition: -(this.state.realHeight - this.state.containerHeight)});
    }
    
    scrollLeft(){
        this.setState({leftPosition: 0});
    }

    scrollRight(){
        this.setState({leftPosition: -(this.state.realWidth - this.state.containerWidth)});
    }

    scrollYTo(topPosition){
        let position = this.normalizeTopPosition(-topPosition, this.computeSizes());
        this.setState({topPosition: position});
    }
    
    scrollXTo(leftPosition){
        let position = this.normalizeLeftPosition(-leftPosition, this.computeSizes());
        this.setState({leftPosition: position});
    }

    canScrollY(state = this.state){
        let scrollableY = state.realHeight > state.containerHeight || this.state.topPosition != 0;
        return scrollableY && this.props.vertical;
    }

    canScrollX(state = this.state){
        let scrollableX = state.realWidth > state.containerWidth || this.state.leftPosition != 0;
        return scrollableX && this.props.horizontal;
    }

    getModifiedPositionsIfNeeded(newState){
        var bottomPosition = newState.realHeight - newState.containerHeight;
        if(-this.state.topPosition >= bottomPosition){
            newState.topPosition = this.canScrollY(newState)? -positiveOrZero(bottomPosition): 0;
        }

        var rightPosition = newState.realWidth - newState.containerWidth;
        if(-this.state.leftPosition >= rightPosition){
            newState.leftPosition = this.canScrollX(newState)? -positiveOrZero(rightPosition): 0;
        }

        return newState;
    }
}

ScrollArea.childContextTypes = {
    scrollArea: React.PropTypes.object
};

ScrollArea.propTypes = {
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
};

ScrollArea.defaultProps = {
    speed: 1,
    vertical: true,
    horizontal: true
};
