import React from 'react';
import Scrollbar from './scrollBar.js';

class ScrollArea extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            topPosition: 0,
            leftPosition: 0,
            realHeight: 0,
            containerHeight: 0,
            realWidth: 0,
            containerWidth: 0,
            scrollableX: false,
            scrollableY: false
        };

        this.bindedHandleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount(){
        window.addEventListener("resize", this.bindedHandleWindowResize);
        this.setHeightsToState();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.bindedHandleWindowResize);
    }

    componentWillReceiveProps(newProps){
        this.setHeightsToState();
    }

    render(){
        var style = {
            marginTop: this.state.topPosition,
            marginLeft: this.state.leftPosition
        };

        var scrollbarY = this.state.scrollableY? (
            <Scrollbar
                realSize={this.state.realHeight}
                containerSize={this.state.containerHeight}
                position={-this.state.topPosition}
                onMove={this.handleMove.bind(this)}
                type="vertical"/>
        ): null;

        var scrollbarX = this.state.scrollableX? (
            <Scrollbar
                realSize={this.state.realWidth}
                containerSize={this.state.containerWidth}
                position={-this.state.leftPosition}
                onMove={this.handleMove.bind(this)}
                type="horizontal"/>
        ): null;

        var classes = 'scrollarea ' + this.props.className;
        var contentClasses = 'scrollarea-content ' + this.props.contentClassName
        return (
            <div className={classes} onWheel={this.handleWheel.bind(this)}>
                <div ref="content" style={style} className={contentClasses}>
                    {this.props.children}
                </div>
                {scrollbarY}
                {scrollbarX}
            </div>
        );
    }

    handleMove(deltaY, deltaX){
        var newState = this.computeHeights();
        if(newState.scrollableY){
            newState.topPosition = this.computeTopPosition(deltaY);
        }
        if(newState.scrollableX){
            newState.leftPosition = this.computeLeftPosition(deltaX);
        }
        this.setState(newState);
    }

    handleWheel(x){
        var newState = this.computeHeights();
        var deltaY = x.deltaY * this.props.speed;
        var deltaX = x.deltaX * this.props.speed;

        if(newState.scrollableY){
            newState.topPosition = this.computeTopPosition(-deltaY);;
        }

        if(newState.scrollableX){
            newState.leftPosition = this.computeLeftPosition(-deltaX);
        }

        this.setState(newState);
    }

    computeTopPosition(deltaY){
        var newTopPosition = this.state.topPosition + deltaY;
        if(-newTopPosition > this.state.realHeight - this.state.containerHeight){
            newTopPosition = -(this.state.realHeight - this.state.containerHeight);
        } else if(newTopPosition > 0){
            newTopPosition = 0;
        }

        return newTopPosition;
    }

    computeLeftPosition(deltaX){
        var newLeftPosition = this.state.leftPosition + deltaX;
        if(-newLeftPosition > this.state.realWidth - this.state.containerWidth){
            newLeftPosition = -(this.state.realWidth - this.state.containerWidth);
        } else if(newLeftPosition > 0){
            newLeftPosition = 0;
        }

        return newLeftPosition;
    }

    handleWindowResize(){
        var newState = this.computeHeights();
        var bottomPosition = newState.realHeight - newState.containerHeight;
        if(-this.state.topPosition >= bottomPosition){
            newState.topPosition = newState.scrollable? -bottomPosition: 0;
        }
        //TODO: add X
        this.setState(newState);
    }

    computeHeights(){
        var realHeight = React.findDOMNode(this.refs.content).offsetHeight;
        var containerHeight = React.findDOMNode(this).offsetHeight;
        var realWidth = React.findDOMNode(this.refs.content).offsetWidth;
        var containerWidth = React.findDOMNode(this).offsetWidth;
        var scrollableY = realHeight > containerHeight;
        var scrollableX = realWidth > containerWidth;
        console.log(scrollableX, scrollableY);

        return {
            realHeight: realHeight,
            containerHeight: containerHeight,
            realWidth: realWidth,
            containerWidth: containerWidth,
            scrollableX: scrollableX,
            scrollableY: scrollableY
        };
    }

    setHeightsToState(){
        var heights = this.computeHeights();
        this.setState(heights);
    }

    scrollTop(){
        this.setState({topPosition: 0});
    }

    scrollBottom(){
        this.setState({topPosition: -(this.state.realHeight - this.state.containerHeight)});
    }
}

ScrollArea.propTypes = {
    className: React.PropTypes.string,
    speed: React.PropTypes.number,
    contentClassName: React.PropTypes.string
};

ScrollArea.defaultProps = {
    speed: 1
};

export default ScrollArea;
