import React from 'react';

class ScrollBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            topPosition: 0,
            scrollHeight: 0,
            isDragging: false,
            lastClientY: 0
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState(this.calculateState(nextProps));
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
        return (
            <div className="scroll-container"
                onMouseMove={this.handleMouseMove.bind(this)} >
                <div className="scroll"
                    style={scrollStyle}
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)} >

                </div>
            </div>
        );
    }

    handleMouseMove(e){
        if(this.state.isDragging){
            var multiplier = this.props.containerHeight / this.props.realHeight;
            var deltaY = this.state.lastClientY - e.clientY;
            var newTopPosition = this.state.topPosition - deltaY;
            console.log("new position", newTopPosition);

            this.setState({ lastClientY: e.clientY });
            this.props.onMove(newTopPosition/multiplier);
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
