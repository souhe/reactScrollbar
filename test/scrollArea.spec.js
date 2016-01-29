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
    let scrollbars = wrapper.props.children.filter(element => element && element.type == Scrollbar);
    
    return {
        wrapper,
        content,
        scrollbars,
        renderer,
        output
    };
}

describe('ScrolLArea component', () => {
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
   
    it('Could render only vertical scrollbar', () => {
        let {scrollbars} = setup({vertical: true, horizontal: false});
        let scrollbar = scrollbars[0];
        
        expect(scrollbars.length).toBe(1);
        expect(scrollbar.props.type).toBe('vertical'); 
    });
   
    it('Could render only horizontal scrollbar', () => {
        let {scrollbars} = setup({vertical: false, horizontal: true});
        let scrollbar = scrollbars[0];
        
        expect(scrollbars.length).toBe(1);
        expect(scrollbar.props.type).toBe('horizontal'); 
   });
   
   it('Should change content element class when contentClassName porp is used', () => {
        let {content} = setup({contentClassName: 'test-class'});
        
        expect(content.props.className).toInclude('test-class');
   });
   
   it('Should have proper scrollbars styles', () => {
        let {content, scrollbars} = setup({
            vertical: true,
            verticalScrollbarStyle: {test: 'verticalScrollbarStyle'},
            verticalContainerStyle: {test: 'verticalContainerStyle'},
            horizontal: true,
            horizontalScrollbarStyle: {test: 'horizontalScrollbarStyle'},
            horizontalContainerStyle: {test: 'horizontalContainerStyle'}
        });
        
        let verticalScrollbar = scrollbars.filter(component => component.props.type === 'vertical')[0];
        let horizontalScrollbar = scrollbars.filter(component => component.props.type === 'horizontal')[0];
        
        expect(verticalScrollbar.props.containerStyle).toEqual({test: 'verticalContainerStyle'});
        expect(verticalScrollbar.props.scrollbarStyle).toEqual({test: 'verticalScrollbarStyle'});
        expect(horizontalScrollbar.props.containerStyle).toEqual({test: 'horizontalContainerStyle'});
        expect(horizontalScrollbar.props.scrollbarStyle).toEqual({test: 'horizontalScrollbarStyle'});
            
   });
});