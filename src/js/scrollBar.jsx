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

    componentDidMount(){
        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
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

        var scrollbarClasses = 'scrollbar-container';
        if(this.state.isDragging) scrollbarClasses += ' active';

        return (
            <div className={scrollbarClasses}
                 >
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
