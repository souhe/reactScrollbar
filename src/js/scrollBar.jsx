import React from 'react';

class ScrollBar extends React.Component {
    render(){
        return (
            <div className="scroll-container">
                <div className="scroll"></div>
            </div>
        );
    }
}

ScrollBar.propTypes = {
    onMove: React.PropTypes.func,
    realHeight: React.PropTypes.number,
    containerHeight: React.PropTypes.number,
    scrollTop: React.PropTypes.number
};

export default ScrollBar;
