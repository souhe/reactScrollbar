import React from 'react'

// import ScrollArea from '../../dist/scrollArea.js'; //TODO: toggle comments
import ScrollArea from '../../src/js/scrollArea.jsx';

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            itemsCount : 12
        };
    }


    handleAddClick(){
        this.setState({itemsCount: this.state.itemsCount + 10});
    }

    render() {
        return (
            <div>
                <ScrollArea className="area" contentClassName="content">

                    <Content itemsCount={this.state.itemsCount} />

                </ScrollArea>
            </div>
        );
    }
}

class Content extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            itemsCount : props.itemsCount
        };
    }

    componentWillRecieveProps(newProps){
        this.setState({itemsCount: newProps.itemsCount})
    }

    render(){
        var itemElements = [];

        for( var i = 0; i< this.state.itemsCount; i++){
            itemElements.push(<div className="item">Item {i}</div>);
        }

        return (
            <div>
                {itemElements}
                <button onClick={this.handleAddButtonClick.bind(this)} >Add 10</button>
                <button onClick={this.handleRemoveButtonClick.bind(this)} >Remove 10</button>
            </div>
        )
    }

    handleAddButtonClick(){
        this.setState({itemsCount: this.state.itemsCount + 10});
    }

    handleRemoveButtonClick(){
        this.setState({itemsCount: this.state.itemsCount - 10});

    }
}


export default App;
