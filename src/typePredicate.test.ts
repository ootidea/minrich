import { expect, expectTypeOf, test } from 'vitest'
import { assertTypeEquality } from './type'
import { IsEqual, isFalsy, isInstanceOf, isNotOneOf, isOneOf, IsOneOf, isTruthy } from './typePredicate'

test('IsEqual', () => {
  assertTypeEquality<IsEqual<'abc', 'abc'>, true>()
  assertTypeEquality<IsEqual<1, number>, false>()
  assertTypeEquality<IsEqual<any, unknown>, false>()
  assertTypeEquality<IsEqual<any, never>, false>()
  assertTypeEquality<IsEqual<unknown, never>, false>()
  assertTypeEquality<IsEqual<void, undefined>, false>()

  assertTypeEquality<IsEqual<1 | 2, 2 | 1>, true>()
  assertTypeEquality<IsEqual<1 | never, 1>, true>()
  assertTypeEquality<IsEqual<boolean, true | false>, true>()

  assertTypeEquality<IsEqual<string & {}, string>, false>()
  assertTypeEquality<IsEqual<string & {}, {}>, false>()

  assertTypeEquality<IsEqual<[a: string], [b: string]>, true>()
  assertTypeEquality<IsEqual<[string?], [] | [string]>, false>()
  assertTypeEquality<IsEqual<[string, ...string[]], [...string[], string]>, false>()
})

test('IsOneOf', () => {
  assertTypeEquality<IsOneOf<string, [string, number]>, true>()
  assertTypeEquality<IsOneOf<string, [number, bigint]>, false>()
  assertTypeEquality<IsOneOf<string, [any, unknown, never]>, false>()
  assertTypeEquality<IsOneOf<string, [string | number]>, false>()
  assertTypeEquality<IsOneOf<'text', [string]>, false>()
  assertTypeEquality<IsOneOf<any, []>, false>()
})

test('isOneOf', () => {
  expect(isOneOf('a', 'a', 0, true)).toBe(true)
  expect(isOneOf('Z', 'a', 0, true)).toBe(false)
})

test('isOneOf.defer', () => {
  expect(isOneOf.defer('a', 0, true)('a')).toBe(true)
  expect(isOneOf.defer('a', 0, true)('Z')).toBe(false)
})

test('isNotOneOf', () => {
  expect(isNotOneOf('a', 'a', 0, true)).toBe(false)
  expect(isNotOneOf('Z', 'a', 0, true)).toBe(true)
})

test('isNotOneOf.defer', () => {
  expect(isNotOneOf.defer('a', 0, true)('a')).toBe(false)
  expect(isNotOneOf.defer('a', 0, true)('Z')).toBe(true)
})

test('isTruthy', () => {
  expect(isTruthy(false)).toBe(false)
  expect(isTruthy(null)).toBe(false)
  expect(isTruthy(undefined)).toBe(false)
  expect(isTruthy(0)).toBe(false)
  expect(isTruthy(0n)).toBe(false)
  expect(isTruthy('')).toBe(false)
  expect(isTruthy(NaN)).toBe(false)

  expect(isTruthy(1)).toBe(true)
  expect(isTruthy(1n)).toBe(true)
  expect(isTruthy('a')).toBe(true)
  expect(isTruthy({})).toBe(true)
  expect(isTruthy([])).toBe(true)
  expect(isTruthy(() => {})).toBe(true)

  expectTypeOf(isTruthy(false)).toEqualTypeOf<false>()
  expectTypeOf(isTruthy(null)).toEqualTypeOf<false>()
  expectTypeOf(isTruthy(undefined)).toEqualTypeOf<false>()
  expectTypeOf(isTruthy(0)).toEqualTypeOf<false>()
  expectTypeOf(isTruthy(0n)).toEqualTypeOf<false>()
  expectTypeOf(isTruthy('')).toEqualTypeOf<false>()

  expectTypeOf(isTruthy(1)).toEqualTypeOf<boolean>()
  expectTypeOf(isTruthy(NaN)).toEqualTypeOf<boolean>()
  expectTypeOf(isTruthy({})).toEqualTypeOf<boolean>()
  expectTypeOf(isTruthy([])).toEqualTypeOf<boolean>()
})

test('isFalsy', () => {
  expect(isFalsy(false)).toBe(true)
  expect(isFalsy(null)).toBe(true)
  expect(isFalsy(undefined)).toBe(true)
  expect(isFalsy(0)).toBe(true)
  expect(isFalsy(0n)).toBe(true)
  expect(isFalsy('')).toBe(true)
  expect(isFalsy(NaN)).toBe(true)

  expect(isFalsy(1)).toBe(false)
  expect(isFalsy(1n)).toBe(false)
  expect(isFalsy('a')).toBe(false)
  expect(isFalsy({})).toBe(false)
  expect(isFalsy([])).toBe(false)
  expect(isFalsy(() => {})).toBe(false)
})

test('isInstanceOf', () => {
  expect(isInstanceOf([], Array)).toBe(true)
  expect(isInstanceOf(/a/, RegExp)).toBe(true)
  expect(isInstanceOf('2021-09-27T15:08:10.78', Date)).toBe(false)
  expect(isInstanceOf({}, Object)).toBe(true)
})

test('isInstanceOf.defer', () => {
  expect(isInstanceOf.defer(Array)([])).toBe(true)
  expect(isInstanceOf.defer(RegExp)(/a/)).toBe(true)
  expect(isInstanceOf.defer(Date)('2021-09-27T15:08:10.78')).toBe(false)
  expect(isInstanceOf.defer(Object)({})).toBe(true)
})