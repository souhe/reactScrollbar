import React from 'react';
import Scrollbar from './scrollBar.jsx';

class ScrollArea extends React.Component{
    constructor(props){
        this.state = {
            topPosition: 0,
            realHeight: 0,
            containerHeight: 0
        };
    }

    componentDidMount(){
        this.setHeightsToState();
    }

    componentWillReceiveProps(newProps){
        this.setHeightsToState();
    }

    render(){
        var style = {
            marginTop: this.state.topPosition
        };

        var classes = 'scrollarea ' + this.props.className;
        return (
            <div className={classes} onWheel={this.handleWheel.bind(this)} style={{position: 'relative'}}>
                <div ref="content" style={style} className="scrollarea-content">
                    {this.props.children}
                </div>
                <Scrollbar
                    realHeight={this.state.realHeight}
                    containerHeight={this.state.containerHeight}
                    scrollTop={-this.state.topPosition}
                    onMove={this.handleMove.bind(this)}/>
            </div>
        );
    }

    handleMove(deltaY){
        var newTopPosition = this.computeTopPosition(deltaY);
        this.setState({topPosition: newTopPosition});
    }

    handleWheel(x){
        var newTopPosition = this.computeTopPosition(-x.deltaY);
        this.setState({topPosition: newTopPosition});
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

    setHeightsToState(){
        var content = React.findDOMNode(this.refs.content);
        var container = React.findDOMNode(this);

        this.setState({
            realHeight: content.offsetHeight,
            containerHeight: container.offsetHeight
        });
    }
}

ScrollArea.propTypes = {
    className: React.PropTypes.string,
    speed: React.PropTypes.number
};

export default ScrollArea;
