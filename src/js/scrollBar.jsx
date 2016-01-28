import React from 'react';
import classNames from 'classnames';
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
        document.addEventListener("mousemove", this.bindedHandleMouseMove);
        document.addEventListener("mouseup", this.bindedHandleMouseUp);
    }

    componentWillReceiveProps(nextProps){
        this.setState(this.calculateState(nextProps));
    }

    componentWillUnmount(){
        document.removeEventListener("mousemove", this.bindedHandleMouseMove);
        document.removeEventListener("mouseup", this.bindedHandleMouseUp);
    }

    calculateState(props){
        let scrollSize = props.containerSize * props.containerSize / props.realSize;
        let multiplier = props.containerSize / props.realSize;
        let position = props.position * multiplier;

        return {
            scrollSize: scrollSize,
            position: position
        };
    }

    render(){
        let scrollStyles = this.createScrollStyles();
        let springifiedScrollStyles = this.props.smoothScrolling ? modifyObjValues(this.createScrollStyles(), x => spring(x)) : scrollStyles;

        let scrollbarClasses = classNames(['scrollbar-container', {
            'active': this.state.isDragging,
            'horizontal': this.props.type === 'horizontal',
            'vertical': this.props.type === 'vertical'
        }]);

        return (
            <Motion style={{...this.props.scrollbarStyle, ...springifiedScrollStyles}}>
                { style => 
                    <div className={scrollbarClasses} style={this.props.containerStyle} >
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
    smoothScrolling: React.PropTypes.bool
};

ScrollBar.defaultProps = {
    type : 'vertical',
    smoothScrolling: false
}
export default ScrollBar;
