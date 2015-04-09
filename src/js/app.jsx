import React from 'react';
import ViewActionCreators from '../actions/viewActionCreators.js';
import {RouteHandler} from 'react-router';

class App extends React.Component{
    render() {
        return (
            <RouteHandler/>
        );
    }
}

export default App;
