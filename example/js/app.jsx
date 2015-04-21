import React from 'react'

import ScrollArea from '../../dist/scrollArea.js';

class App extends React.Component{
    render() {
        return (
            <ScrollArea className="area" contentClassName="content">

                <div className="item">item 1</div>
                <div className="item">item 2</div>
                <div className="item">item 3</div>
                <div className="item">item 4</div>
                <div className="item">item 5</div>
                <div className="item">item 6</div>
                <div className="item">item 7</div>
                <div className="item">item 8</div>
                <div className="item">item 9</div>
                <div className="item">item 10</div>
                
            </ScrollArea>
        );
    }
}

export default App;
