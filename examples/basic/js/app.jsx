import React from 'react'
import ScrollArea from '../../../src/js/scrollArea'; 
class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            itemsCount : 10
        };
    }

    handleAddClick(){
        this.setState({itemsCount: this.state.itemsCount + 10});
    }

    render() {
        var itemElements = [];

        for( var i = 0; i< this.state.itemsCount; i++){
            itemElements.push(<div className="item" key={i}>item {i}</div>);
        }

        return (
            <div>
                <ScrollArea className="area" contentClassName="content">

                    {itemElements}

                </ScrollArea>

            </div>
        );
    }
}

export default App;
