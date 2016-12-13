import React from 'react';

export function isReact13(react) {
  const { version } = react;
  if (typeof version !== 'string') {
    return true;
  }

  const parts = version.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);

  return major === 0 && minor === 13;
}

const react13 = isReact13(React);
let didWarnAboutChild = false;

export function findDOMNode(component) {
  if (!react13) {
    return component;
  }

  return React.findDOMNode(component);
}

export function warnAboutFunctionChild() {
  if (didWarnAboutChild || react13) {
    return;
  }

  didWarnAboutChild = true;
  console.error('With React 0.14 and later versions, you no longer need to wrap <ScrollArea> child into a function.');
}

export function warnAboutElementChild() {
  if (didWarnAboutChild || !react13) {
    return;
  }

  didWarnAboutChild = true;
  console.error('With React 0.13, you need to wrap <ScrollArea> child into a function.');
}

export function positiveOrZero(number) {
  return number < 0 ? 0 : number;
}

export function modifyObjValues(obj, modifier = x => x) {
  const modifiedObj = Object.keys(obj).reduce((acc, key) =>
    ({ ...acc, [key]: modifier(obj[key]) }), {});

  return modifiedObj;
}
