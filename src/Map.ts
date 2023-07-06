import { Branded } from './type'

declare const NON_EMPTY_MAP_TAG: unique symbol
export type NonEmptyMap<K, T> = Branded<Map<K, T>, typeof NON_EMPTY_MAP_TAG>
export type ReadonlyNonEmptyMap<K, T> = Branded<ReadonlyMap<K, T>, typeof NON_EMPTY_MAP_TAG>

/**
 * Wrapper function for the Map constructor.
 * Use to avoid name conflicts.
 */
export function newMap<K, T>(...args: ConstructorParameters<typeof Map<K, T>>): Map<K, T> {
  return new Map(...args)
}

/**
 * Create a Map object from a tuple of key-value pairs.
 * More precisely typed than Map constructor.
 * @example
 * mapOf([true, 1], [false, 0]) returns new Map([[true, 1], [false, 0]])
 * mapOf([true, 1], [false, 0]) is typed as Map<boolean, 0 | 1>
 * @example
 * mapOf() returns new Map()
 * mapOf() is typed as Map<never, never>
 */
export function mapOf<const T extends readonly (readonly [any, any])[]>(...args: T): Map<T[number][0], T[number][1]> {
  return new Map(args)
}
