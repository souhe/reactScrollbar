import React from 'react';
import Scrollbar from './scrollBar.js';

class ScrollArea extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            topPosition: 0,
            realHeight: 0,
            containerHeight: 0,
            scrollable: false
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
            marginTop: this.state.topPosition
        };

        var scrollbar = this.state.scrollable? (
            <Scrollbar
                realHeight={this.state.realHeight}
                containerHeight={this.state.containerHeight}
                scrollTop={-this.state.topPosition}
                onMove={this.handleMove.bind(this)}/>
        ): null;

        var classes = 'scrollarea ' + this.props.className;
        return (
            <div className={classes} onWheel={this.handleWheel.bind(this)}>
                <div ref="content" style={style} className="scrollarea-content">
                    {this.props.children}
                </div>
                {scrollbar}
            </div>
        );
    }

    handleMove(deltaY){
        var newState = this.computeHeights();
        if(newState.scrollable){
            newState.topPosition = this.computeTopPosition(deltaY)
        }
        this.setState(newState);
    }

    handleWheel(x){
        var newState = this.computeHeights();
        var deltaY = x.deltaY * this.props.speed;
        if(newState.scrollable){
            newState.topPosition = this.computeTopPosition(-deltaY);
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

    handleWindowResize(){
        var newState = this.computeHeights();
        var bottomPosition = newState.realHeight - newState.containerHeight;
        if(-this.state.topPosition >= bottomPosition){
            newState.topPosition = newState.scrollable? -bottomPosition: 0;
        }

        this.setState(newState);
    }

    computeHeights(){
        var realHeight = React.findDOMNode(this.refs.content).offsetHeight;
        var containerHeight = React.findDOMNode(this).offsetHeight;
        var scrollable = realHeight > containerHeight;

        return {
            realHeight: realHeight,
            containerHeight: containerHeight,
            scrollable: scrollable
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
    speed: React.PropTypes.number
};

ScrollArea.defaultProps = {
    speed: 1
};

export default ScrollArea;
