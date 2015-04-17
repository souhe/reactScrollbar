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
        var content = React.findDOMNode(this.refs.content);
        var container = React.findDOMNode(this);

        this.setState({
            realHeight: content.offsetHeight,
            containerHeight: container.offsetHeight
        })
    }

    render(){
        var style = {
            marginTop: this.state.topPosition
        };

        return (
            <div className={this.props.className} onWheel={this.handleWheel.bind(this)}>
                <div ref="content" style={style}>
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

    handleMove(topPosition){
        console.log('cont top pos', topPosition);
        this.setState({topPosition});
    }

    handleWheel(x){
        var element = React.findDOMNode(this.refs.content);
        // element.margin += x.deltaY;
        var newTopPosition = this.state.topPosition - x.deltaY;
        if(-newTopPosition > this.state.realHeight - this.state.containerHeight){
            newTopPosition = -(this.state.realHeight - this.state.containerHeight);
        } else if(newTopPosition > 0){
            newTopPosition = 0;
        }
        this.setState({topPosition: newTopPosition});
    }
}

ScrollArea.propTypes = {
    className: React.PropTypes.string,
    speed: React.PropTypes.number
};

export default ScrollArea;
