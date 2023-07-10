import { expect, test } from 'vitest'
import { differenceOf, intersectionOf, isDisjoint, isSubsetOf, setOf, setWhetherHas, toggle, unionOf } from './Set'

test('setOf', () => {
  expect(setOf(1, 2)).toStrictEqual(new Set([2, 1]))
})

test('toggle', () => {
  expect(toggle(setOf(1, 2, 3), 2)).toStrictEqual(setOf(1, 3))
  expect(toggle(setOf(1, 2, 3), 9)).toStrictEqual(setOf(1, 2, 3, 9))
  expect(toggle(setOf(1, 2, 3), null)).toStrictEqual(setOf(1, 2, 3, null))
})
test('toggle.mutable', () => {
  const set = setOf(1, 2, 3)
  toggle.mutable(set, 2)
  expect(set).toStrictEqual(setOf(1, 3))
  toggle.mutable(set, 4)
  expect(set).toStrictEqual(setOf(1, 3, 4))
})

test('setWhetherHas', () => {
  expect(setWhetherHas(setOf(1, 2, 3), 2, false)).toStrictEqual(setOf(1, 3))
  expect(setWhetherHas(setOf(1, 2, 3), 2, true)).toStrictEqual(setOf(1, 2, 3))
  expect(setWhetherHas(setOf(1, 2, 3), 9, false)).toStrictEqual(setOf(1, 2, 3))
  expect(setWhetherHas(setOf(1, 2, 3), 9, true)).toStrictEqual(setOf(1, 2, 3, 9))
})

test('unionOf', () => {
  expect(unionOf(setOf(1, 2, 3), setOf(3, 4, 5))).toStrictEqual(setOf(1, 2, 3, 4, 5))
})

test('intersectionOf', () => {
  expect(intersectionOf(setOf(1, 2, 3), setOf(2, 3, 4))).toStrictEqual(setOf(2, 3))
})

test('differenceOf', () => {
  expect(differenceOf(setOf(1, 2, 3), setOf(2, 3, 4))).toStrictEqual(setOf(1))
})

test('isDisjoint', () => {
  expect(isDisjoint(setOf(1, 2, 3), setOf(3, 4, 5))).toBe(false)
  expect(isDisjoint(setOf(1, 2, 3), setOf(4, 5))).toBe(true)
})

test('isSubsetOf', () => {
  expect(isSubsetOf(setOf(1, 2), setOf(1, 2, 3))).toBe(true)
  expect(isSubsetOf(setOf(1, 2), setOf(1, 2))).toBe(true)
  expect(isSubsetOf(setOf(1, 2, 3), setOf(1, 2))).toBe(false)
  expect(isSubsetOf(setOf(1, 2, 3), setOf(3, 4, 5))).toBe(false)
})
