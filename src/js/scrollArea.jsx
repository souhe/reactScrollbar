import '../less/scrollbar.less';
import React from 'react';
import Scrollbar from './scrollBar';
import ReactDOM from 'react-dom';



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
            // scrollableX: false,
            // scrollableY: false
        };

        this.scrollArea = {
            refresh: () => {
                this.setSizesToState();
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
        this.setSizesToState();
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.bindedHandleWindowResize);
    }

    componentDidUpdate(){
        this.setSizesToState();
    }

    render(){
        var style = {
            marginTop: this.state.topPosition,
            marginLeft: this.state.leftPosition
        };

        var scrollbarY = this.canScrollY()? (
            <Scrollbar
                realSize={this.state.realHeight}
                containerSize={this.state.containerHeight}
                position={-this.state.topPosition}
                onMove={this.handleMove.bind(this)}
                type="vertical"/>
        ): null;

        var scrollbarX = this.canScrollX()? (
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
                <div ref="content"
                    style={style}
                    className={contentClasses}
                    onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchMove={this.handleTouchMove.bind(this)}>
                    {this.props.children}
                </div>
                {scrollbarY}
                {scrollbarX}
            </div>
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
        var deltaY = e.deltaY * this.props.speed;
        var deltaX = e.deltaX * this.props.speed;

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

        if(-newTopPosition > sizes.realHeight - sizes.containerHeight){
            newTopPosition = -(sizes.realHeight - sizes.containerHeight);
        }
        if(newTopPosition > 0){
            newTopPosition = 0;
        }
        return newTopPosition;
    }

    computeLeftPosition(deltaX, sizes){
        var newLeftPosition = this.state.leftPosition + deltaX;
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
        var realHeight = ReactDOM.findDOMNode(this.refs.content).offsetHeight;
        var containerHeight = ReactDOM.findDOMNode(this).offsetHeight;
        var realWidth = ReactDOM.findDOMNode(this.refs.content).offsetWidth;
        var containerWidth = ReactDOM.findDOMNode(this).offsetWidth;
        // var scrollableY = realHeight > containerHeight || this.state.topPosition != 0;
        // var scrollableX = realWidth > containerWidth || this.state.leftPosition != 0;

        return {
            realHeight: realHeight,
            containerHeight: containerHeight,
            realWidth: realWidth,
            containerWidth: containerWidth,
            // scrollableX: scrollableX,
            // scrollableY: scrollableY
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

    canScrollY(state = this.state){
        let scrollableY = state.realHeight > state.containerHeight || this.state.topPosition != 0;
        return scrollableY && this.props.vertical;
    }

    canScrollX(state = this.state){
        let scrollableX = state.realHeight > state.containerHeight || this.state.topPosition != 0
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

function positiveOrZero(number){
    return number < 0 ? 0 : number;
}

ScrollArea.childContextTypes = {
    scrollArea: React.PropTypes.object
};

ScrollArea.propTypes = {
    className: React.PropTypes.string,
    speed: React.PropTypes.number,
    contentClassName: React.PropTypes.string,
    vertical: React.PropTypes.bool,
    horizontal: React.PropTypes.bool
};

ScrollArea.defaultProps = {
    speed: 1,
    vertical: true,
    horizontal: true
};

export default ScrollArea;
