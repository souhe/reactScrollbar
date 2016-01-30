import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import React, { Component } from 'react';
import {render} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ScrollArea from '../src/js/scrollArea';
import Scrollbar from '../src/js/scrollBar';

function setupScrollBar(props){
    let renderer = TestUtils.createRenderer();
    renderer.render(<Scrollbar {...props}/>);
    let instance = getRendererComponentInstance(renderer);
    let output = renderer.getRenderOutput();
    let wrapper = output.props.children();

    let content = wrapper.props.children;
    
    return {
        wrapper,
        content,
        renderer,
        output,
        instance
    };
}

function getRendererComponentInstance(renderer){
    return renderer._instance? renderer._instance._instance : null;
}

describe('ScrollBar component', () => {
    it('Vertical should have proper class', () => {
        let {wrapper} = setupScrollBar({type: 'vertical'});
        
        expect(wrapper.props.className).toInclude('vertical');
    });
    
    it('Horizontal should have proper class', () => {
        let {wrapper} = setupScrollBar({type: 'horizontal'});
        
        expect(wrapper.props.className).toInclude('horizontal');
    });
    
    it('ScrollBar should be in proper position', () => {
       let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100, 
           position: -20
       });
                 
       expect(instance.state.position).toBe(-5);    
    });
    
    it('ScrollBar should have proper size', () => {
       let { instance } = setupScrollBar({
           realSize: 400, 
           containerSize: 100
       });
           
       expect(instance.state.scrollSize).toBe(25);   
    });
    
    it('Should propagate onMove event after move vertical scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy
       });
       let mouseDoewnEvent = {clientY: 0, preventDefault: () => {}};
       let moveEvent = {clientY: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForVertical(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([-100 , 0]);
    });
    
    it('Should propagate onMove event after move horizontal scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy,
           type: 'horizontal'
       });
       let mouseDoewnEvent = {clientX: 0, preventDefault: () => {}};
       let moveEvent = {clientX: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForHorizontal(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([0, -100]);
    });
    
    it('Should propagate onMove event multiple times', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollBar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy
       });
       let mouseDoewnEvent = {clientY: 0, preventDefault: () => {}};
       let moveEvent = {clientY: 10, preventDefault: () => {}};
       instance.handleMouseDown(mouseDoewnEvent);
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 20;
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 30;
       instance.handleMouseMoveForVertical(moveEvent);
       moveEvent.clientY = 40;
       instance.handleMouseMoveForVertical(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(4);
       expect(handleMoveSpy.calls[3].arguments).toEqual([-40 , 0]);
    });
});