import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);

import React, { Component } from 'react';
import {render} from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ScrollArea from '../src/js/ScrollArea';
import Scrollbar from '../src/js/Scrollbar';

function setup(props, sizes){
    let renderer = TestUtils.createRenderer();
    renderer.render(<ScrollArea {...props}><p>content</p></ScrollArea>);
    let instance = getRendererComponentInstance(renderer);

    if(sizes){
        instance.computeSizes = () => sizes;
        instance.setSizesToState();
    }

    let output = renderer.getRenderOutput();

    let wrapper = output.props.children();

    let content = wrapper.props.children[0];
    let scrollbars = wrapper.props.children.filter(element => element && element.type == Scrollbar);

    return {
        wrapper,
        content,
        scrollbars,
        renderer,
        output,
        instance
    };
}

function setupComponentWithMockedSizes(props) {
    let component = setup(props, {
        realHeight: 300,
        containerHeight: 100,
        realWidth: 300,
        containerWidth: 100
    });

    return component;
}

function getRendererComponentInstance(renderer){
    return renderer._instance? renderer._instance._instance : null;
}

describe('ScrollArea component', () => {
    it('Should render children and both scrollbars', () => {
        let {scrollbars, content} = setupComponentWithMockedSizes();

        expect(scrollbars.length).toBe(2);

        expect(content).toEqualJSX(
            <div ref={() => {}}
                style={{}}
                className="scrollarea-content "
                onTouchStart={() => {}}
                onTouchMove={() => {}}
                onTouchEnd={() => {}}
                onKeyDown={() => {}}
                tabIndex={1}
            >
                <p>content</p>
            </div>);
    });

    it('Should render with tabindex set', () => {
        let {scrollbars, content} = setupComponentWithMockedSizes({focusableTabIndex: 100});

        expect(scrollbars.length).toBe(2);
        expect(content).toEqualJSX(
            <div ref={() => {}}
                style={{}}
                tabIndex={100}
                className="scrollarea-content "
                onTouchStart={() => {}}
                onTouchMove={() => {}}
                onTouchEnd={() => {}}
                onKeyDown={() => {}}
            >
                <p>content</p>
            </div>);
    });

    it('Could render only vertical scrollbar', () => {
        let {scrollbars} = setupComponentWithMockedSizes({vertical: true, horizontal: false});
        let scrollbar = scrollbars[0];

        expect(scrollbars.length).toBe(1);
        expect(scrollbar.props.type).toBe('vertical');
    });

    it('Could render only horizontal scrollbar', () => {
        let {scrollbars} = setupComponentWithMockedSizes({vertical: false, horizontal: true});
        let scrollbar = scrollbars[0];

        expect(scrollbars.length).toBe(1);
        expect(scrollbar.props.type).toBe('horizontal');
    });

    it('Should change content element class when contentClassName prop is used', () => {
        let {content} = setup({contentClassName: 'test-class'});

        expect(content.props.className).toInclude('test-class');
    });

    it('Should have proper element style when contentStyle prop is used', () => {
        let {content, instance} = setupComponentWithMockedSizes({
            contentStyle: {test: 'contentStyle'},
        });

        expect(content.props.style).toEqual({ test: 'contentStyle' });
    });

    it('Should have proper scrollbars styles', () => {
        let {content, scrollbars} = setupComponentWithMockedSizes({
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

    it('normalizeTopPosition() should returns proper value', () => {
        let {instance} = setup();
        let {normalizeTopPosition} = instance;
        let sizes = {realHeight: 30, containerHeight: 20};

        expect(normalizeTopPosition(0, sizes)).toBe(0);
        expect(normalizeTopPosition(5, sizes)).toBe(5);
        expect(normalizeTopPosition(10, sizes)).toBe(10);
        expect(normalizeTopPosition(11, sizes)).toBe(10);
        expect(normalizeTopPosition(-1, sizes)).toBe(0);
        expect(normalizeTopPosition(-60, sizes)).toBe(0);
        expect(normalizeTopPosition(100, sizes)).toBe(10);
    });

    it('normalizeLeftPosition() should returns proper value', () => {
        let {instance} = setup();
        let {normalizeLeftPosition} = instance;
        let sizes = {realWidth: 30, containerWidth: 20};

        expect(normalizeLeftPosition(0, sizes)).toBe(0);
        expect(normalizeLeftPosition(5, sizes)).toBe(5);
        expect(normalizeLeftPosition(10, sizes)).toBe(10);
        expect(normalizeLeftPosition(11, sizes)).toBe(10);
        expect(normalizeLeftPosition(-1, sizes)).toBe(0);
        expect(normalizeLeftPosition(-60, sizes)).toBe(0);
        expect(normalizeLeftPosition(100, sizes)).toBe(10);
    });

    it('handleWheel method work properly when scrolling down', () => {
        let {instance} = setupComponentWithMockedSizes();
        let e = {deltaY:20, deltaX: 0, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.topPosition).toBe(20);
    });

    it('handleWheel method work properly when scrolling up and actual topPosition is 0', () => {
        let {instance} = setupComponentWithMockedSizes();
        let e = {deltaY:-10, deltaX: 0, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.topPosition).toBe(0);
    });

    it('handleWheel method work properly when scrolling down more then content height', () => {
        let {instance} = setupComponentWithMockedSizes();

        for(let i = 0; i < 10; i++){
            let e = {deltaY:50, deltaX: 0, preventDefault: () => {}, stopPropagation: () => {}};
            instance.handleWheel(e);
        }

        expect(instance.state.topPosition).toBe(200);
    });

    it('handleWheel method work properly when scrolling right', () => {
        let {instance} = setupComponentWithMockedSizes();
        let e = {deltaY:0, deltaX: 20, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.leftPosition).toBe(20);
    });

    it('handleWheel method work properly when scrolling left and actual leftPosition is 0', () => {
        let {instance} = setupComponentWithMockedSizes();
        let e = {deltaY:0, deltaX: -10, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.leftPosition).toBe(0);
    });

    it('handleWheel method work properly when scrolling right more then content height', () => {
        let {instance} = setupComponentWithMockedSizes();

        for(let i = 0; i < 10; i++){
            let e = {deltaY:0, deltaX: 50, preventDefault: () => {}, stopPropagation: () => {}};
            instance.handleWheel(e);
        }

        expect(instance.state.leftPosition).toBe(200);
    });

    it('handleWheel method should scroll down on scrollRight wheel event when revertWheelAxes prop is set to true', () => {
        let {instance} = setupComponentWithMockedSizes({
            swapWheelAxes: true
        });

        let e = {deltaY:0, deltaX: 20, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.topPosition).toBe(20);
    });

    it('handleWheel method should scroll down on scrollRight wheel event when revertWheelAxes prop is set to true', () => {
        let {instance} = setupComponentWithMockedSizes({
            swapWheelAxes: true
        });

        let e = {deltaY:20, deltaX: 0, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleWheel(e);

        expect(instance.state.leftPosition).toBe(20);
    });

    it('handleKeyDown method works properly when pressing key down', () => {
        let {instance} = setupComponentWithMockedSizes();

        let e = {keyCode:40, target:{tagName:'div'}, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleKeyDown(e);

        expect(instance.state.topPosition).toBe(10);
    });

    it('handleKeyDown method works properly when pressing key right', () => {
        let {instance} = setupComponentWithMockedSizes();

        let e = {keyCode:39, target:{tagName:'div'}, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleKeyDown(e);

        expect(instance.state.leftPosition).toBe(10);
    });

    it('handleKeyDown method works properly when pressing key page down', () => {
        let {instance} = setupComponentWithMockedSizes();

        let e = {keyCode:34, target:{tagName:'div'}, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleKeyDown(e);

        expect(instance.state.topPosition).toBe(instance.state.containerHeight - 10);
    });

    it('handleKeyDown method should not scroll if input element is selected', () => {
        let {instance} = setupComponentWithMockedSizes();

        let e = {keyCode:40, target:{tagName:'input'}, preventDefault: () => {}, stopPropagation: () => {}};
        instance.handleKeyDown(e);

        expect(instance.state.topPosition).toBe(0);
    });

    it('scrollBottom() method should work when content is smaller then container', () => {
        let {instance} = setup({}, {
            realHeight: 30,
            containerHeight: 100,
            realWidth: 30,
            containerWidth: 100
        });

        instance.scrollBottom();
        expect(instance.state.topPosition).toBe(0);
    });


    it('scrollBottom() method should scroll to bottom', () => {
        let {instance} = setup({}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });

        instance.scrollBottom();
        expect(instance.state.topPosition).toBe(100);
    });

    it('scrollBottom() should be impossible when there is disabled vertical scroll', () => {
        let {instance} = setup({vertical: false}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });

        instance.scrollBottom();
        expect(instance.state.topPosition).toBe(0);
    });

    it('scrollRight() method should work when content is smaller then container', () => {
        let {instance} = setup({}, {
            realHeight: 30,
            containerHeight: 100,
            realWidth: 30,
            containerWidth: 100
        });

        instance.scrollRight();
        expect(instance.state.topPosition).toBe(0);
    });


    it('scrollRight() method should scroll to right', () => {
        let {instance} = setup({}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });

        instance.scrollRight();
        expect(instance.state.leftPosition).toBe(100);
    });

    it('scrollRight() should be impossible when there is disabled horizontal scroll', () => {
        let {instance} = setup({horizontal: false}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });

        instance.scrollRight();
        expect(instance.state.topPosition).toBe(0);
    });

    it('scrollLeft() method should scroll to left', () => {
        let {instance} = setup({}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });
        instance.scrollXTo(50);

        instance.scrollLeft();
        expect(instance.state.leftPosition).toBe(0);
    });

    it('scrollTop() method should scroll to top', () => {
        let {instance} = setup({}, {
            realHeight: 200,
            containerHeight: 100,
            realWidth: 200,
            containerWidth: 100
        });
        instance.scrollYTo(50);

        instance.scrollTop();
        expect(instance.state.topPosition).toBe(0);
    });
});
