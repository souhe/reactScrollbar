import React from 'react';

class ScrollBar extends React.Component {
    constructor(props){
        super(props);
        var newState = this.calculateState(props);
        this.state = {
            topPosition: newState.topPosition,
            scrollHeight: newState.scrollHeight,
            isDragging: false,
            lastClientY: 0
        }

        this.bindedHandleMouseMove = this.handleMouseMove.bind(this);
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
        var scrollHeight = props.containerHeight * props.containerHeight / props.realHeight;
        var multiplier = props.containerHeight / props.realHeight;
        var topPosition = props.scrollTop * multiplier;

        return {
            scrollHeight: scrollHeight,
            topPosition: topPosition
        };
    }

    render(){
        var scrollStyle = {
            height: this.state.scrollHeight,
            marginTop: this.state.topPosition
        };

        var scrollbarClasses = 'scrollbar-container';
        if(this.state.isDragging) scrollbarClasses += ' active';

        return (
            <div className={scrollbarClasses} >
                <div className="scrollbar"
                    style={scrollStyle}
                    onMouseDown={this.handleMouseDown.bind(this)}
                    >

                </div>
            </div>
        );
    }

    handleMouseMove(e){
        var multiplier = this.props.containerHeight / this.props.realHeight;
        if(this.state.isDragging){
            e.preventDefault();
            var deltaY = this.state.lastClientY - e.clientY;
            this.setState({ lastClientY: e.clientY });
            this.props.onMove(deltaY / multiplier);
        }
    }

    handleMouseDown(e){
        this.setState({isDragging: true, lastClientY: e.clientY });
    }

    handleMouseUp(e){
        this.setState({isDragging: false });
    }
}

ScrollBar.propTypes = {
    onMove: React.PropTypes.func,
    realHeight: React.PropTypes.number,
    containerHeight: React.PropTypes.number,
    scrollTop: React.PropTypes.number
};

export default ScrollBar;
