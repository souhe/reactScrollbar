import React from 'react'
// import ScrollArea from '../../../dist/scrollArea.js';
import ScrollArea from '../../../src/js/scrollArea'; //FIXME: remove


class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            itemsCount : 12
        };
    }

    render() {
        return (
            <div>
                <ScrollArea className="area" contentClassName="content">

                    {() => <Content itemsCount={this.state.itemsCount} />}

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

    render(){
        var itemElements = [];

        for( var i = 0; i< this.state.itemsCount; i++){
            itemElements.push(<div className="item" key={i}>Item {i}</div>);
        }

        return (
            <div>
                {itemElements}
                <button onClick={this.handleAddButtonClick.bind(this)} >Add 10</button>
                <button onClick={this.handleRemoveButtonClick.bind(this)} >Remove 10</button>
            </div>
        );
    }

    handleAddButtonClick(){
        this.setState({itemsCount: this.state.itemsCount + 10}, this.context.scrollArea.refresh);
    }

    handleRemoveButtonClick(){
        this.setState({itemsCount: this.state.itemsCount - 10}, this.context.scrollArea.refresh); //FIXME: not working
    }
}

Content.contextTypes = {
    scrollArea: React.PropTypes.object
};

export default App;
