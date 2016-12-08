import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import React, { Component } from 'react';
import {render} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ScrollArea from '../src/js/ScrollArea';
import Scrollbar from '../src/js/Scrollbar';

function setupScrollbar(props){
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
        let {wrapper} = setupScrollbar({type: 'vertical'});
        
        expect(wrapper.props.className).toInclude('vertical');
    });
    
    it('Vertical should have proper container styles', () => {
        let {wrapper} = setupScrollbar({
            type: 'vertical',
            containerStyle: {test: 'containerStyle'},
        });

        expect(wrapper.props.style).toEqual({test: 'containerStyle'});
    });

    it('Vertical should have proper scrollbar styles', () => {
        let {content} = setupScrollbar({
            type: 'vertical',
            scrollbarStyle: {test: 'scrollbarStyle'},
        });

        expect(content.props.style).toEqual({test: 'scrollbarStyle'});
    });
    
    it('Horizontal should have proper class', () => {
        let {wrapper} = setupScrollbar({type: 'horizontal'});
        
        expect(wrapper.props.className).toInclude('horizontal');
    });
    
    it('Horizontal should have proper container styles', () => {
        let {wrapper} = setupScrollbar({
            type: 'horizontal',
            containerStyle: {test: 'containerStyle'},
        });

        expect(wrapper.props.style).toEqual({test: 'containerStyle'});
    });

    it('Horizontal should have proper scrollbar styles', () => {
        let {content} = setupScrollbar({
            type: 'horizontal',
            scrollbarStyle: {test: 'scrollbarStyle'},
        });

        expect(content.props.style).toEqual({test: 'scrollbarStyle'});
    });
    
    it('ScrollBar should be in proper position', () => {
       let {instance} = setupScrollbar({
           realSize: 400, 
           containerSize: 100, 
           position: 20
       });
                 
       expect(instance.state.position).toBe(5);    
    });
    
    it('ScrollBar should have proper size', () => {
       let { instance } = setupScrollbar({
           realSize: 400, 
           containerSize: 100
       });
           
       expect(instance.state.scrollSize).toBe(25);   
    });
    
    it('Should propagate onMove event after move vertical scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollbar({
           realSize: 200, 
           containerSize: 100,
           onMove: handleMoveSpy,
            onFocus: () => {}
       });
       let mouseDownEvent = {clientY: 0, preventDefault: () => {}, stopPropagation: () => {}};
       let moveEvent = {clientY: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDownEvent);
       instance.handleMouseMoveForVertical(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([-50 , 0]);
    });
    
    it('Should propagate onMove event after move horizontal scrollbar', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollbar({
           realSize: 200, 
           containerSize: 100,
           onMove: handleMoveSpy,
           type: 'horizontal',
            onFocus: () => {}
       });
       let mouseDownEvent = {clientX: 0, preventDefault: () => {}, stopPropagation: () => {}};
       let moveEvent = {clientX: 25, preventDefault: () => {}};
       instance.handleMouseDown(mouseDownEvent);
       instance.handleMouseMoveForHorizontal(moveEvent);
       
       expect(handleMoveSpy.calls.length).toEqual(1);
       expect(handleMoveSpy.calls[0].arguments).toEqual([0, -50]);
    });
    
    it('Should propagate onMove event multiple times', () => {
        let handleMoveSpy = expect.createSpy();
        let {instance} = setupScrollbar({
           realSize: 400, 
           containerSize: 100,
           onMove: handleMoveSpy,
            onFocus: () => {}
       });
       let mouseDownEvent = {clientY: 0, preventDefault: () => {}, stopPropagation: () => {}};
       let moveEvent = {clientY: 10, preventDefault: () => {}};
       instance.handleMouseDown(mouseDownEvent);
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
    
    it('Should be possible to set min scrollbar size', () => {
        let minScrollBarSize = 10;
        let {instance} = setupScrollbar({
            realSize: 10000, 
            containerSize: 100,
            type: 'vertical',
            minScrollSize: minScrollBarSize,
            onFocus: () => {}
        });     
       
        expect(instance.state.scrollSize).toBe(minScrollBarSize);   
    });
    
    it('Method calculateFractionalPosition should work properly for realSize: 300, containerSize: 100, position: 0', () => {
        let {instance} = setupScrollbar();
        
        expect(instance.calculateFractionalPosition(300, 100, 0)).toEqual(0);
    });
    
    it('Method calculateFractionalPosition should work properly for realSize: 300, containerSize: 100, position: 200', () => {
        let {instance} = setupScrollbar();
        
        expect(instance.calculateFractionalPosition(300, 100, 200)).toEqual(1);
    });
    
    it('Method calculateFractionalPosition should work properly for realSize: 300, containerSize: 100, position: 200', () => {
        let {instance} = setupScrollbar();
        
        expect(instance.calculateFractionalPosition(300, 100, 100)).toEqual(0.5);
    });
    
    it('Method calculateFractionalPosition should work properly for realSize: 160, containerSize: 80, position: 20', () => {
        let {instance} = setupScrollbar();
        
        expect(instance.calculateFractionalPosition(160, 80, 20)).toEqual(0.25);
    });
    
    it('Position of scrollbar should be proper when minScrollBarSize is set', () => {
        let {instance} = setupScrollbar({
            position: 9900, 
            realSize: 10000,
            containerSize: 100,
            type: 'vertical',
            minScrollSize: 10
        });    
        
        expect(instance.state.position).toBe(90);
    });
    
    it('vertical scrollbar container click should move scrollbar', () => {
        let handlePositionChangeSpy = expect.createSpy();
        let {instance} = setupScrollbar({
            position: 0,
            realSize: 500, 
            containerSize: 100,
            type: 'vertical',
            onPositionChange: handlePositionChangeSpy
       });
       let mouseDownEvent = {clientY: 50, preventDefault: () => {}};
       instance.scrollbarContainer = {
           getBoundingClientRect: () => ({
               top: 0, left: 0
           })
       };
       instance.handleScrollBarContainerClick(mouseDownEvent);
       
       expect(handlePositionChangeSpy.calls.length).toEqual(1);
       expect(handlePositionChangeSpy.calls[0].arguments).toEqual([200]); 
    });
    
    it('vertical scrollbar container click should move scrollbar when minScrollbar size is set', () => {
        let handlePositionChangeSpy = expect.createSpy();
        let {instance} = setupScrollbar({
            position: 0,
            realSize: 1000, 
            containerSize: 100,
            type: 'vertical',
            onPositionChange: handlePositionChangeSpy,
            minScrollBarSize: 30
       });
       let mouseDownEvent = {clientY: 25, preventDefault: () => {}};
       instance.scrollbarContainer = {
           getBoundingClientRect: () => ({
               top: 0, left: 0
           })
       };
       instance.handleScrollBarContainerClick(mouseDownEvent);
       
       expect(handlePositionChangeSpy.calls.length).toEqual(1);
       expect(handlePositionChangeSpy.calls[0].arguments).toEqual([200]); 
    });
    
    it('horizontal scrollbar container click should move scrollbar', () => {
        let handlePositionChangeSpy = expect.createSpy();
        let {instance} = setupScrollbar({
            position: 0,
            realSize: 500, 
            containerSize: 100,
            type: 'horizontal',
            onPositionChange: handlePositionChangeSpy
       });
       let mouseDownEvent = {clientX: 50, preventDefault: () => {}};
       instance.scrollbarContainer = {
           getBoundingClientRect: () => ({
               top: 0, left: 0
           })
       };
       instance.handleScrollBarContainerClick(mouseDownEvent);
       
       expect(handlePositionChangeSpy.calls.length).toEqual(1);
       expect(handlePositionChangeSpy.calls[0].arguments).toEqual([200]); 
    });
    
    it('horizontal scrollbar container click should move scrollbar when minScrollbar size is set', () => {
        let handlePositionChangeSpy = expect.createSpy();
        let {instance} = setupScrollbar({
            position: 0,
            realSize: 1000, 
            containerSize: 100,
            type: 'horizontal',
            onPositionChange: handlePositionChangeSpy,
            minScrollBarSize: 30
       });
       let mouseDownEvent = {clientX: 25, preventDefault: () => {}};
       instance.scrollbarContainer = {
           getBoundingClientRect: () => ({
               top: 0, left: 0
           })
       };
       instance.handleScrollBarContainerClick(mouseDownEvent);
       
       expect(handlePositionChangeSpy.calls.length).toEqual(1);
       expect(handlePositionChangeSpy.calls[0].arguments).toEqual([200]); 
    });
});
