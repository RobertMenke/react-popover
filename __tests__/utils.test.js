import { isDOMRect } from '../src/utils'

test('isDOMRect returns false when no element is passed', () => {
  expect(isDOMRect()).toBe(false);
})

test('isDOMRect returns false for null input', () => {
  expect(isDOMRect(null)).toBe(false);
})

test('isDOMRect returns false for primitive types', () => {
  expect(isDOMRect(1)).toBe(false);
})

test('isDOMRect returns false for empty strings', () => {
  expect(isDOMRect('')).toBe(false);
})

test('isDOMRect returns false for non-empty strings', () => {
  expect(isDOMRect('1')).toBe(false);
})

test('isDOMRect returns false for empty', () => {
  expect(isDOMRect({})).toBe(false);
})

test('isDOMRect returns false for arrays', () => {
  expect(isDOMRect([])).toBe(false);
})

test('isDOMRect returns false when "top" is missing from the rect object', () => {
  const rect = { left: 0, right: 0, bottom: 0}
  expect(isDOMRect(rect)).toBe(false);
})

test('isDOMRect returns false when "left" is missing from the rect object', () => {
  const rect = { top: 0, right: 0, bottom: 0}
  expect(isDOMRect(rect)).toBe(false);
})

test('isDOMRect returns false when "right" is missing from the rect object', () => {
  const rect = { top: 0, left: 0, bottom: 0}
  expect(isDOMRect(rect)).toBe(false);
})

test('isDOMRect returns false when "bottom" is missing from the rect object', () => {
  const rect = { top: 0, left: 0, right: 0}
  expect(isDOMRect(rect)).toBe(false);
})

test('isDOMRect returns true for objects that mimic DOMRect', () => {
  const rect = { top: 0, left: 0, right: 0, bottom: 0}
  expect(isDOMRect(rect)).toBe(true);
})

test('isDOMRect returns true for true DOMRect objects', () => {
  const el = document.createElement('div');
  expect(isDOMRect(el.getBoundingClientRect())).toBe(true);
})
