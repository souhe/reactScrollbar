import React from 'react';
import {Motion, spring} from 'react-motion';
import {modifyObjValues} from './utils';

class ScrollBar extends React.Component {
    constructor(props){
        super(props);
        let newState = this.calculateState(props);
        this.state = {
            position: newState.position,
            scrollSize: newState.scrollSize,
            isDragging: false,
            lastClientPosition: 0
        }

        if(props.type === 'vertical'){
            this.bindedHandleMouseMove = this.handleMouseMoveForVertical.bind(this);
        } else {
            this.bindedHandleMouseMove = this.handleMouseMoveForHorizontal.bind(this);
        }

        this.bindedHandleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount(){
        this.props.ownerDocument.addEventListener("mousemove", this.bindedHandleMouseMove);
        this.props.ownerDocument.addEventListener("mouseup", this.bindedHandleMouseUp);
    }

    componentWillReceiveProps(nextProps){
        this.setState(this.calculateState(nextProps));
    }

    componentWillUnmount(){
        this.props.ownerDocument.removeEventListener("mousemove", this.bindedHandleMouseMove);
        this.props.ownerDocument.removeEventListener("mouseup", this.bindedHandleMouseUp);
    }

    calculateFractionalPosition(realSize, containerSize, position){
        let relativeSize = realSize - containerSize;
        let positivePosition = Math.abs(position);
        
        return 1 - ((relativeSize - positivePosition) / relativeSize);
    }

    calculateState(props){
        let fractionalPosition = this.calculateFractionalPosition(props.realSize, props.containerSize, props.position); 
        let proportionalToPageScrollSize = props.containerSize * props.containerSize / props.realSize;
        let scrollSize = proportionalToPageScrollSize < props.minScrollSize ? props.minScrollSize : proportionalToPageScrollSize;

        let position = (props.containerSize - scrollSize) * fractionalPosition;    
        return {
            scrollSize: scrollSize,
            position: Math.round(position)
        };
    }

    render(){
        let {smoothScrolling, isDragging, type, scrollbarStyle, containerStyle} = this.props;
        let isVoriziontal = type === 'horizontal';
        let isVertical = type === 'vertical';
        let scrollStyles = this.createScrollStyles();
        let springifiedScrollStyles = smoothScrolling ? modifyObjValues(scrollStyles, x => spring(x)) : scrollStyles;

        let scrollbarClasses = `scrollbar-container ${isDragging ? 'active' : ''} ${isVoriziontal ? 'horizontal' : ''} ${isVertical ? 'vertical' : ''}`; 

        return (
            <Motion style={{...scrollbarStyle, ...springifiedScrollStyles}}>
                { style => 
                    <div className={scrollbarClasses} style={containerStyle} >
                <div className="scrollbar"
                            style={style}
                    onMouseDown={this.handleMouseDown.bind(this)}
                    >
                </div>
            </div>
                }
            </Motion>
        );
    }

    handleMouseMoveForHorizontal(e){
        let multiplier = this.props.containerSize / this.props.realSize;
        if(this.state.isDragging){
            e.preventDefault();
            let deltaX = this.state.lastClientPosition - e.clientX;
            this.setState({ lastClientPosition: e.clientX });
            this.props.onMove(0, deltaX / multiplier);
        }
    }

    handleMouseMoveForVertical(e){
        let multiplier = this.props.containerSize / this.props.realSize;
        if(this.state.isDragging){
            e.preventDefault();
            let deltaY = this.state.lastClientPosition - e.clientY;
            this.setState({ lastClientPosition: e.clientY });
            this.props.onMove(deltaY / multiplier, 0);
        }
    }

    handleMouseDown(e){
        let lastClientPosition = this.props.type === 'vertical'? e.clientY: e.clientX
        this.setState({isDragging: true, lastClientPosition: lastClientPosition });
    }

    handleMouseUp(e){
        this.setState({isDragging: false });
    }

    createScrollStyles(){
        if(this.props.type === 'vertical'){
            return {
                height: this.state.scrollSize,
                marginTop: this.state.position
            };
        } else {
            return {
                width: this.state.scrollSize,
                marginLeft: this.state.position
            };
        }
    }
}

ScrollBar.propTypes = {
    onMove: React.PropTypes.func,
    realSize: React.PropTypes.number,
    containerSize: React.PropTypes.number,
    position: React.PropTypes.number,
    containerStyle: React.PropTypes.object,
    scrollbarStyle: React.PropTypes.object,
    type: React.PropTypes.oneOf(['vertical', 'horizontal']),
    ownerDocument: React.PropTypes.any,
    smoothScrolling: React.PropTypes.bool,
    minScrollSize: React.PropTypes.number
};

ScrollBar.defaultProps = {
    type : 'vertical',
    ownerDocument: document,
    smoothScrolling: false
}
export default ScrollBar;
