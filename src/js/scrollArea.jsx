import React from 'react';
import Scrollbar from './scrollBar.jsx';

class ScrollArea extends React.Component{
    render(){
        return (
            <div className={this.props.className} onWheel={this.handleWheel.bind(this)}>
                <div ref="content">
                    {this.props.children}
                </div>
                <Scrollbar />
            </div>
        );
    }

    handleWheel(x){
        var element = React.findDOMNode(this);
        element.scrollTop += x.deltaY;
    }
}

ScrollArea.propTypes = {
    className: React.PropTypes.string,
    speed: React.PropTypes.number
};

export default ScrollArea;
