const isObject = obj => obj != null && typeof obj === 'object';

const isValidBoundingClientRect = clientRect => {
  if (!isObject(clientRect)) {
    return false;
  }

  const { top, left, right, bottom } = clientRect;
  return top != null && left != null && right != null && bottom != null;
}

export const isDOMRect = rect => {
  if (!window.DOMRect) {
    return isValidBoundingClientRect(rect)
  }

  return rect instanceof window.DOMRect
}
