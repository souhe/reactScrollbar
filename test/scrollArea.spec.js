import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import ScrollArea from '../src/js/scrollArea';
import Scrollbar from '../src/js/scrollBar';

function setup(props){
    let renderer = TestUtils.createRenderer();
    renderer.render(<ScrollArea {...props}><p>content</p></ScrollArea>);
    let output = renderer.getRenderOutput();

    let wrapper = output.props.children();

    let content = wrapper.props.children[0];
    let scrollbars = wrapper.props.children.filter(element => element.type == Scrollbar);
    
    return {
        wrapper,
        content,
        scrollbars,
        renderer,
        output
    };
}

describe('ScrolLArea', () => {
   it('Should render children and both scrollbars', () => {      
        let {scrollbars, content} = setup();

        expect(scrollbars.length).toBe(2);
        expect(content).toEqualJSX(
            <div ref={() => {}} 
                style={undefined}
                className="scrollarea-content "
                onTouchStart={() => {}}
                onTouchMove={() => {}}
                onTouchEnd={() => {}}>
                <p>content</p>
            </div>);
   });
});