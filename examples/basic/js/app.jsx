import React from 'react'
import ScrollArea from 'react-scrollbar';

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            itemsCount : 40
        };
    }

    handleAddClick(){
        this.setState({itemsCount: this.state.itemsCount + 10});
    }

    handleScroll(scrollData){
      console.log(scrollData);
    }

    render() {
        var itemElements = [];

        for( var i = 0; i< this.state.itemsCount; i++){
            itemElements.push(<div className="item" key={i}>item {i}</div>);
        }

        let scrollBarStyles = {borderRadius: 5};

        return (
            <div>
                <ScrollArea
                  className="area"
                  contentClassName="content"
                  verticalScrollbarStyle={scrollBarStyles}
                  verticalContainerStyle={scrollBarStyles}
                  horizontalScrollbarStyle={scrollBarStyles}
                  horizontalContainerStyle={scrollBarStyles}
                  smoothScrolling= {true}
                  minScrollSize={40}
                  onScroll={this.handleScroll}
                  >

                    {itemElements}

                </ScrollArea>

            </div>
        );
    }
}

export default App;
