import ReactDOM from 'react-dom'

const isObject = obj => obj != null && typeof obj === 'object';

const isValidBoundingClientRect = clientRect => {
  if (!isObject(clientRect)) {
    return false;
  }

  const { top, left, right, bottom } = clientRect;
  return top != null && left != null && right != null && bottom != null;
}

/**
* Returns whether or not the passed in object is a DOMRect, or at least is in
* the shape of a DOMRect.
*
* @param rect: Object
* @returns boolean
*/
export const isDOMRect = rect => {
  if (!window.DOMRect) {
    return isValidBoundingClientRect(rect);
  }

  return rect instanceof window.DOMRect;
}

/**
* Returns an object representing the boundingClientRect for the given element,
* or an empty object if not found.
*
* @param element: HTMLElement|ReactComponent
* @returns Object
*/
export const getBoundingClientRectForElement = element => {
  if (element != null) {
    // native elements
    if (element.getBoundingClientRect) {
      return element.getBoundingClientRect();
    }

    // Assume React Element
    const domNode = ReactDOM.findDOMNode(element)
    if (domNode.getBoundingClientRect) {
      return domNode.getBoundingClientRect();
    }
  }

  return {};
}
