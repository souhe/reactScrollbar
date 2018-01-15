export function findDOMNode(component) {
  return component;
}

export function positiveOrZero(number) {
  return number < 0 ? 0 : number;
}

export function modifyObjValues(obj, modifier = x => x) {
  const modifiedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) modifiedObj[key] = modifier(obj[key]);
  }

  return modifiedObj;
}
