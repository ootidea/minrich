import { randomIntegerUntil, Until } from './number'
import { PseudoAny } from './type'

export type AccurateTuple = readonly PseudoAny[]
export type Tuple = readonly any[]

export type NonEmptyArray<T> = [T, ...T[]]
export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]]

/**
 * @example
 * FixedSizeArray<3> is equivalent to [unknown, unknown, unknown]
 * @example
 * FixedSizeArray<3, boolean> is equivalent to [boolean, boolean, boolean]
 * @example
 * FixedSizeArray<0, Set<number>> is equivalent to []
 * @example
 * FixedSizeArray<2 | 3, any> is equivalent to [any, any] | [any, any, any]
 * @example
 * FixedSizeArray<number, bigint> is equivalent to readonly bigint[]
 */
export type FixedSizeArray<N extends number, T = unknown> = number extends N
  ? readonly T[]
  : N extends N
  ? _FixedSizeArray<N, T>
  : never
type _FixedSizeArray<N extends number, T = unknown, Result extends readonly T[] = []> = Result['length'] extends N
  ? Result
  : _FixedSizeArray<N, T, [...Result, T]>

export type LimitedSizeArray<N extends number, T = unknown> = FixedSizeArray<N | Until<N>, T>

export function shuffle<T>(self: []): []
export function shuffle<T>(self: readonly [T]): readonly [T]
export function shuffle<T>(self: ReadonlyNonEmptyArray<T>): ReadonlyNonEmptyArray<T>
export function shuffle<T>(self: readonly T[]): readonly T[]
export function shuffle<T>(self: readonly T[]): readonly T[] {
  const result: T[] = []
  for (let i = 0; i < self.length; ++i) {
    const j = randomIntegerUntil(i + 1)
    if (j < i) {
      result.push(result[j])
    }
    result[j] = self[i]
  }
  return result
}