import { ReadonlyNonEmptyArray } from './Array/MinLengthArray'
import { Tuple } from './Array/other'
import { isNotEmpty } from './collectionPredicate'
import { update } from './collectionUpdate'
import { newSet } from './Set'

export function filter(self: readonly [], f: (_: any) => boolean): []
export function filter<T, U extends T>(self: readonly T[], f: (_: T) => _ is U): U[]
export function filter<T>(self: readonly T[], f: (_: T) => boolean): T[]
export function filter<T>(self: readonly T[], f: (_: T) => boolean): T[] {
  return self.filter(f) as any
}
export namespace filter {
  export function defer<T, U extends T>(f: (_: T) => _ is U): { (self: readonly []): []; (self: readonly T[]): U[] }
  export function defer<T>(f: (_: T) => boolean): { (self: readonly []): []; (self: readonly T[]): T[] }
  export function defer<T>(f: (_: T) => boolean) {
    return (self: readonly T[]) => self.filter(f)
  }

  export function Iterable<T, U extends T>(self: Iterable<T>, f: (_: T) => _ is U): Iterable<U>
  export function Iterable<T>(self: Iterable<T>, f: (_: T) => boolean): Iterable<T>
  export function* Iterable<T>(self: Iterable<T>, f: (_: T) => boolean): Iterable<T> {
    for (const value of self) {
      if (f(value)) {
        yield value
      }
    }
  }

  export function Set<T, U extends T>(self: ReadonlySet<T>, f: (_: T) => _ is U): Set<U>
  export function Set<T>(self: ReadonlySet<T>, f: (_: T) => boolean): Set<T>
  export function Set<T>(self: ReadonlySet<T>, f: (_: T) => boolean): Set<T> {
    return newSet(filter.Iterable(self, f))
  }
}

export function takeWhile<const T, const U extends T>(self: readonly T[], f: (_: T) => _ is U): U[]
export function takeWhile<const T>(self: readonly T[], f: (_: T) => boolean): T[]
export function takeWhile<const T>(self: readonly T[], f: (_: T) => boolean): T[] {
  const result = []
  for (const value of self) {
    if (!f(value)) return result

    result.push(value)
  }
  return result
}
export namespace takeWhile {
  export function Iterable<T, U extends T>(self: Iterable<T>, f: (_: T) => _ is U): Iterable<U>
  export function Iterable<T>(self: Iterable<T>, f: (_: T) => boolean): Iterable<T>
  export function* Iterable<T>(self: Iterable<T>, f: (_: T) => boolean): Iterable<T> {
    for (const value of self) {
      if (!f(value)) return

      yield value
    }
  }
}

/**
 * @example
 * FirstOf<[bigint]> equals bigint
 * FirstOf<[number, bigint]> equals number
 * FirstOf<[]> equals undefined
 * FirstOf<boolean[]> equals boolean | undefined
 * FirstOf<[...string[], number]> equals string | number
 * @example
 * FirstOf<[Date] | [Date, boolean]> equals Date
 * FirstOf<[Date?, boolean?]> equals Date | boolean | undefined
 */
export type FirstOf<T extends Tuple> = T extends readonly [infer First, ...any]
  ? First
  : T extends readonly [...infer U, infer Last]
  ? _FirstOf<U, Last>
  : T extends readonly []
  ? undefined
  : T[number][] extends T
  ? T[number] | undefined
  : T extends readonly [(infer H)?, ...infer L]
  ? H | FirstOf<L>
  : never
type _FirstOf<T extends Tuple, L> = T extends readonly []
  ? L
  : T extends readonly [...infer T2, infer L2]
  ? _FirstOf<T2, L2>
  : T[0] | L
export function firstOf<const T extends Tuple>(self: T): FirstOf<T> {
  return self[0] as any
}

/**
 * @example
 * LastOf<[bigint]> equals bigint
 * LastOf<[bigint, number]> equals number
 * LastOf<[]> equals undefined
 * LastOf<boolean[]> equals boolean | undefined
 * LastOf<[string, ...string[]]> equals string
 * LastOf<[boolean, ...string[]]> equals boolean | string
 * @example
 * LastOf<[Date] | [Date, boolean]> equals Date | boolean
 * LastOf<[Date?, boolean?]> equals Date | boolean | undefined
 */
export type LastOf<T extends Tuple> = T extends readonly [...any, infer Last]
  ? Last
  : T extends readonly []
  ? undefined
  : T extends readonly [infer H, ...infer L]
  ? _LastOf<H, L>
  : T[number][] extends T
  ? T[number] | undefined
  : T extends readonly [(infer H)?, ...infer L]
  ? H | LastOf<L>
  : T[0] | undefined
type _LastOf<H, L extends Tuple> = L extends readonly []
  ? H
  : L extends readonly [infer H2, ...infer L2]
  ? _LastOf<H2, L2>
  : L[number][] extends L
  ? H | L[0]
  : L extends readonly [(infer H2)?, ...infer L2]
  ? _LastOf<H | H2, L2>
  : H | L[0]
export function lastOf<const T extends Tuple>(self: T): LastOf<T> {
  return self[self.length - 1] as any
}

export function indexOf<T>(self: readonly [], value: T, fromIndex?: number): undefined
export function indexOf<T>(self: readonly T[], value: T, fromIndex?: number): number | undefined
export function indexOf<T>(self: readonly T[], value: T, fromIndex?: number): number | undefined {
  const index = self.indexOf(value, fromIndex)
  if (index === -1) return undefined

  return index
}

export function lastIndexOf<T>(self: readonly [], value: T, fromIndex?: number): undefined
export function lastIndexOf<T>(self: readonly T[], value: T, fromIndex?: number): number | undefined
export function lastIndexOf<T>(self: readonly T[], value: T, fromIndex?: number): number | undefined {
  const index = self.lastIndexOf(value, fromIndex)
  if (index === -1) return undefined

  return index
}

export function indexesOf<T>(self: readonly [], value: T): []
export function indexesOf<T>(self: readonly T[], value: T): number[]
export function indexesOf<T>(self: readonly T[], value: T): number[] {
  const result = []
  for (let i = 0; i < self.length; i++) {
    if (self[i] === value) {
      result.push(i)
    }
  }
  return result
}

export function maxOf<const T>(self: ReadonlyNonEmptyArray<T>): T
export function maxOf<T>(self: readonly T[]): T | undefined
export function maxOf<T>(self: readonly T[]): T | undefined {
  if (!isNotEmpty(self)) return undefined

  const [firstElement, ...rest] = self
  let candidateElement = firstElement
  for (const element of rest) {
    if (candidateElement < element) {
      candidateElement = element
    }
  }
  return candidateElement
}

export function maxBy<const T, U>(self: ReadonlyNonEmptyArray<T>, by: (element: T) => U): T
export function maxBy<T, U>(self: readonly T[], by: (element: T) => U): T | undefined
export function maxBy<T, U>(self: readonly T[], by: (element: T) => U): T | undefined {
  if (!isNotEmpty(self)) return undefined

  const [firstElement, ...rest] = self
  let candidateElement = firstElement
  let maxValue = by(firstElement)
  for (const element of rest) {
    const value = by(element)
    if (maxValue < value) {
      candidateElement = element
      maxValue = value
    }
  }
  return candidateElement
}

export function minOf<const T>(self: ReadonlyNonEmptyArray<T>): T
export function minOf<T>(self: readonly T[]): T | undefined
export function minOf<T>(self: readonly T[]): T | undefined {
  if (!isNotEmpty(self)) return undefined

  const [firstElement, ...rest] = self
  let candidateElement = firstElement
  for (const element of rest) {
    if (candidateElement > element) {
      candidateElement = element
    }
  }
  return candidateElement
}

export function minBy<const T, U>(self: ReadonlyNonEmptyArray<T>, by: (element: T) => U): T
export function minBy<T, U>(self: readonly T[], by: (element: T) => U): T | undefined
export function minBy<T, U>(self: readonly T[], by: (element: T) => U): T | undefined {
  if (!isNotEmpty(self)) return undefined

  const [firstElement, ...rest] = self
  let candidateElement = firstElement
  let minValue = by(firstElement)
  for (const element of rest) {
    const value = by(element)
    if (minValue > value) {
      candidateElement = element
      minValue = value
    }
  }
  return candidateElement
}

export function elementAt<T>(self: Iterable<T>, n: number): T | undefined {
  const iterator = self[Symbol.iterator]()
  let i: number
  let element: IteratorResult<T>
  for (i = 0, element = iterator.next(); i < n && !element.done; ++i, element = iterator.next()) {}
  iterator.return?.()
  return element.value
}

export function modeOf<const T>(self: ReadonlyNonEmptyArray<T>): T
export function modeOf<const T>(self: readonly T[]): T | undefined
export function modeOf<const T>(self: readonly T[]): T | undefined {
  const map = new Map<T, number>()
  let maxCount = 0
  let candidateValue: T | undefined = undefined
  for (const value of self) {
    update.Map.mutable(map, value, (prev) => {
      const nextCount = (prev ?? 0) + 1
      if (maxCount < nextCount) {
        maxCount = nextCount
        candidateValue = value
      }
      return nextCount
    })
  }
  return candidateValue
}

export function modeBy<const T, U>(self: ReadonlyNonEmptyArray<T>, by: (_: T) => U): T
export function modeBy<T, U>(self: readonly T[], by: (_: T) => U): T | undefined
export function modeBy<T, U>(self: readonly T[], by: (_: T) => U): T | undefined {
  const map = new Map<U, number>()
  let maxCount = 0
  let candidateValue: T | undefined = undefined
  for (const value of self) {
    update.Map.mutable(map, by(value), (prev) => {
      const nextCount = (prev ?? 0) + 1
      if (maxCount < nextCount) {
        maxCount = nextCount
        candidateValue = value
      }
      return nextCount
    })
  }
  return candidateValue
}
