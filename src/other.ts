export function assert<T, U extends T>(value: T, predicate: (value: T) => value is U): asserts value is U
export function assert<T>(value: T, predicate: (value: T) => boolean): void | never
export function assert<T>(value: T, predicate: (value: T) => boolean): void | never {
  if (predicate(value)) {
    throw new Error()
  }
}

/**
 * Generate a function with Type predicate that checks for equality with the given value.
 * @example As an equivalence function
 * isJust(123)(456) results false
 * isJust(null)(null) results true
 * @example As a type guard function
 * let n = 123
 * assert(n, isJust(456)) will throw an exception.
 * assert(n, isJust(123 as const)) will narrow the type of n to 123.
 */
export const isJust =
  <T extends null | undefined | boolean | number | bigint | string | symbol | object, U extends T>(literal: U) =>
  (value: T): value is U =>
    value === literal

export type nullish = null | undefined

export const isNull = (value: unknown): value is null => value === null
export const isUndefined = (value: unknown): value is undefined => value === undefined
export const isNullish = (value: unknown): value is nullish => value === null || value === undefined
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isBigint = (value: unknown): value is bigint => typeof value === 'bigint'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol'
export const isFunction = (value: unknown): value is Function => typeof value === 'function'
export const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null

export function isInstanceOf<T extends abstract new (..._: any) => any>(
  ctor: T,
  value: unknown
): value is InstanceType<T> {
  return value instanceof ctor
}

/** Convert Less-Than or Equal to (<= symbol) function to comparator. */
export function ltoetToComparator<T>(ltoet: (lhs: T, rhs: T) => boolean): (lhs: T, rhs: T) => number {
  return (lhs, rhs) => {
    if (ltoet(lhs, rhs)) {
      if (ltoet(rhs, lhs)) return 0

      return -1
    }
    return 1
  }
}
