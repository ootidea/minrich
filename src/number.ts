import { FixedLengthArray, ReadonlyNonEmptyArray } from './Array'
import { includes } from './collectionPredicate'
import { RepeatString, ToNumber } from './string'
import { IsEqual, IsOneOf, IsUnion } from './type'

export type MaxNumber = 1.7976931348623157e308
export type Infinity = 1e999
export type NegativeInfinity = -1e999

export const Infinity: Infinity = globalThis.Infinity as Infinity
export const NegativeInfinity: NegativeInfinity = -globalThis.Infinity as NegativeInfinity

/**
 * @example
 * IsNumberLiteral<0> is equivalent to true
 * IsNumberLiteral<1e100> is equivalent to true
 * IsNumberLiteral<Infinity> is equivalent to true
 * IsNumberLiteral<number> is equivalent to false
 * IsNumberLiteral<1 | 2> is equivalent to false
 * IsNumberLiteral<any> is equivalent to false
 * IsNumberLiteral<never> is equivalent to false
 */
export type IsNumberLiteral<T extends number> = IsUnion<T> extends true
  ? false
  : IsOneOf<T, [number, never, any]> extends true
  ? false
  : true

/**
 * @example
 * IsInteger<12.34> is equivalent to false
 * IsInteger<-12> is equivalent to true
 * IsInteger<1.2e-15> is equivalent to false
 * IsInteger<1.2e+15> is equivalent to true
 * @example
 * IsInteger<1.8e+308> is equivalent to false (Note that 1.8e+308 is Infinity)
 * @example Customizing result values
 * IsInteger<12, []> is equivalent to []
 * IsInteger<0.5, number, never> is equivalent to never
 */
export type IsInteger<N extends number, Then = true, Else = false> = N extends N
  ? IsOneOf<N, [number, any]> extends true
    ? boolean
    : `${N}` extends `${string}e+${string}`
    ? Then
    : `${N}` extends `${string}.${string}` | `${string}e-${string}` | 'Infinity' | '-Infinity'
    ? Else
    : Then
  : never

/**
 * @example
 * Abs<-3> is equivalent to 3
 * Abs<0.12> is equivalent to 0.12
 * Abs<-0> is equivalent to 0
 * Abs<-1.2e-45> is equivalent to 1.2e-45
 * Abs<-3 | 5> is equivalent to 3 | 5
 * Abs<number> is equivalent to number
 */
export type Abs<N extends number> = N extends N ? (`${N}` extends `-${infer P extends number}` ? P : N) : never

/**
 * @example
 * Negate<1> is equivalent to -1
 * Negate<-0.5> is equivalent to 0.5
 * Negate<0> is equivalent to 0
 * Negate<-0> is equivalent to 0
 * Negate<1e+100> is equivalent to -1e+100
 * Negate<-1.2e-45> is equivalent to 1.2e-45
 * Negate<2 | -4> is equivalent to -2 | 4
 * Negate<number> is equivalent to number
 */
export type Negate<N extends number> = N extends 0
  ? 0
  : number extends N
  ? number
  : N extends N
  ? `${N}` extends `-${infer P extends number}`
    ? P
    : `-${N}` extends `${infer M extends number}`
    ? M
    : never
  : never

/**
 * @example
 * Trunc<3.5> is equivalent to 3
 * Trunc<-0.09> is equivalent to 0
 * Trunc<-12> is equivalent to -12
 * Trunc<8.2e-9> is equivalent to 0
 * Trunc<1e+100> is equivalent to 1e+100
 * Trunc<1.1 | 3.3> is equivalent to 1 | 3
 * Trunc<number> is equivalent to number
 */
export type Trunc<N extends number> = number extends N
  ? number
  : N extends N
  ? `${N}` extends `${string}e-${string}`
    ? 0
    : `${N}` extends `${string}e+${string}`
    ? N
    : `${N}` extends `-0.${string}`
    ? 0
    : `${N}` extends `${infer I extends number}.${string}`
    ? I
    : N
  : never

/**
 * Type-level function of N <= M.
 * It's orders of magnitude faster compared to a naive implementation.
 * @param N - A natural number literal type
 * @param M - A natural number literal type
 * @returns true if N <= M, false otherwise
 *
 * @example
 * LteNaturalNumber<3, 4> is equivalent to true
 * LteNaturalNumber<4, 4> is equivalent to true
 * LteNaturalNumber<5, 4> is equivalent to false
 * LteNaturalNumber<9, 123> is equivalent to true
 * @example
 * LteNaturalNumber<1234567, 1234560> is equivalent to false
 */
export type LteNaturalNumber<N extends number, M extends number> = IsEqual<N, M> extends true
  ? true
  : _LteNaturalNumber<`${N}`, `${M}`>
type _LteNaturalNumber<
  Lhs extends string,
  Rhs extends string,
  LA extends readonly Digit[] = [],
  RA extends readonly Digit[] = []
> = Lhs extends `${infer LH extends Digit}${infer LL}`
  ? Rhs extends `${infer RH extends Digit}${infer RL}`
    ? _LteNaturalNumber<LL, RL, [LH, ...LA], [RH, ...RA]>
    : false
  : Rhs extends `${infer RH extends Digit}${infer RL}`
  ? true
  : _LteNaturalNumberLexicographic<LA, RA>
/**
 * @example
 * _LteNaturalNumberLexicographic<['4'], ['4']> is equivalent to true
 * _LteNaturalNumberLexicographic<['1', '2'], ['4']> is equivalent to true
 * _LteNaturalNumberLexicographic<['1', '2'], ['1']> is equivalent to false
 * _LteNaturalNumberLexicographic<['1', '2'], ['1', '5']> is equivalent to true
 * _LteNaturalNumberLexicographic<['1', '2'], ['0', '5']> is equivalent to false
 * _LteNaturalNumberLexicographic<[], ['0']> is equivalent to true
 */
type _LteNaturalNumberLexicographic<Lhs extends readonly Digit[], Rhs extends readonly Digit[]> = Lhs extends readonly [
  infer LH extends Digit,
  ...infer LL extends readonly Digit[]
]
  ? Rhs extends readonly [infer RH extends Digit, ...infer RL extends readonly Digit[]]
    ? IsEqual<LH, RH, _LteNaturalNumberLexicographic<LL, RL>, LtDigit<LH, RH>>
    : false
  : true

type LtDigit<Lhs extends Digit, Rhs extends Digit> = Lhs extends DigitToRangeUntil<Rhs> ? true : false

/**
 * @example
 * Min<0, 3> is equivalent to 0
 * Min<2, 2> is equivalent to 2
 * Min<-1, 2> is equivalent to -1
 * Min<-1, -4> is equivalent to -4
 */
export type Min<N extends number, M extends number> = `${N}` extends `-${infer PN extends number}`
  ? `${M}` extends `-${infer PM extends number}`
    ? [...FixedLengthArray<PN>, ...any] extends [...FixedLengthArray<PM>, ...any]
      ? N
      : M
    : N
  : `${M}` extends `-${infer PM extends number}`
  ? M
  : [...FixedLengthArray<N>, ...any] extends [...FixedLengthArray<M>, ...any]
  ? M
  : N

/**
 * @example
 * Max<0, 3> is equivalent to 3
 * Max<2, 2> is equivalent to 2
 * Max<-1, 2> is equivalent to 2
 * Max<-1, -4> is equivalent to -1
 */
export type Max<N extends number, M extends number> = `${N}` extends `-${infer PN extends number}`
  ? `${M}` extends `-${infer PM extends number}`
    ? [...FixedLengthArray<PN>, ...any] extends [...FixedLengthArray<PM>, ...any]
      ? M
      : N
    : M
  : `${M}` extends `-${infer PM extends number}`
  ? N
  : [...FixedLengthArray<N>, ...any] extends [...FixedLengthArray<M>, ...any]
  ? N
  : M

/**
 * Convert a natural number type into an array type of its digits.
 * @example
 * ToDigitArray<123> is equivalent to ['1', '2', '3']
 * ToDigitArray<0> is equivalent to ['0']
 */
export type ToDigitArray<N extends number> = _ToDigitArray<`${N}`>
type _ToDigitArray<S extends string> = S extends `${infer H extends Digit}${infer L}` ? [H, ..._ToDigitArray<L>] : []

/**
 * @example
 * Increment<0> is equivalent to 1
 * Increment<-1> is equivalent to 0
 * Increment<-2> is equivalent to -1
 * Increment<1 | 3> is equivalent to 2 | 4
 * Increment<number> is equivalent to number
 */
export type Increment<N extends number> = `${N}` extends `-${infer PN extends number}`
  ? FixedLengthArray<PN> extends [any, ...infer L]
    ? Negate<L['length']>
    : never
  : [1, ...FixedLengthArray<N>]['length'] extends infer R extends number
  ? R
  : never

export type Decrement<N extends number> = `${N}` extends `-${infer PN extends number}`
  ? [1, ...FixedLengthArray<PN>]['length'] extends infer R extends number
    ? Negate<R>
    : never
  : FixedLengthArray<N> extends [any, ...infer L]
  ? L['length']
  : -1

/**
 * @example
 * IntegerRangeUntil<3> is equivalent to 0 | 1 | 2
 * IntegerRangeUntil<4, 8> is equivalent to 4 | 5 | 6 | 7
 * IntegerRangeUntil<5, 3> is equivalent to 5 | 4
 * @example
 * IntegerRangeUntil<2, -2> is equivalent to 2 | 1 | 0 | -1
 * IntegerRangeUntil<-2, 2> is equivalent to -2 | -1 | 0 | 1
 * @example
 * IntegerRangeUntil<1, 1> is equivalent to never
 * IntegerRangeUntil<0> is equivalent to never
 * @example
 * IntegerRangeUntil<2 | 4> is equivalent to 0 | 1 | 2 | 3
 * IntegerRangeUntil<number, 9> is equivalent to number
 * IntegerRangeUntil<9, number> is equivalent to number
 */
export type IntegerRangeUntil<N extends number, M extends number | undefined = undefined> = number extends N
  ? number
  : number extends M
  ? number
  : N extends N
  ? M extends M
    ? M extends number
      ? `${N}` extends `-${infer PN extends number}`
        ? `${M}` extends `-${infer PM extends number}`
          ? [...FixedLengthArray<PN>, ...any] extends [...FixedLengthArray<PM>, ...any]
            ? Negate<Exclude<NaturalNumbersFrom0Through<PN>, NaturalNumbersFrom0Through<PM>>>
            : Negate<Exclude<NaturalNumbersFrom0Until<PM>, NaturalNumbersFrom0Until<PN>>>
          : Negate<NaturalNumbersFrom0Through<PN>> | NaturalNumbersFrom0Until<M>
        : `${M}` extends `-${infer PM extends number}`
        ? NaturalNumbersFrom0Through<N> | Negate<NaturalNumbersFrom0Until<PM>>
        : [...FixedLengthArray<N>, ...any] extends [...FixedLengthArray<M>, ...any]
        ? Exclude<NaturalNumbersFrom0Through<N>, NaturalNumbersFrom0Through<M>>
        : Exclude<NaturalNumbersFrom0Until<M>, NaturalNumbersFrom0Until<N>>
      : IntegerRangeUntil<0, N>
    : never
  : never
/**
 * @example
 * IntegerRangeThrough<3> is equivalent to 0 | 1 | 2 | 3
 * IntegerRangeThrough<4, 8> is equivalent to 4 | 5 | 6 | 7 | 8
 * IntegerRangeThrough<5, 3> is equivalent to 5 | 4 | 3
 * @example
 * IntegerRangeThrough<2, -2> is equivalent to 2 | 1 | 0 | -1 | -2
 * IntegerRangeThrough<-2, 2> is equivalent to -2 | -1 | 0 | 1 | 2
 * @example
 * IntegerRangeThrough<1, 1> is equivalent to 1
 * IntegerRangeThrough<0> is equivalent to 0
 * @example
 * IntegerRangeThrough<2 | 4> is equivalent to 0 | 1 | 2 | 3 | 4
 * IntegerRangeThrough<number, 9> is equivalent to number
 * IntegerRangeThrough<9, number> is equivalent to number
 */
export type IntegerRangeThrough<N extends number, M extends number | undefined = undefined> = number extends N
  ? number
  : number extends M
  ? number
  : N extends N
  ? M extends M
    ? M extends number
      ? `${N}` extends `-${infer PN extends number}`
        ? `${M}` extends `-${infer PM extends number}`
          ? [...FixedLengthArray<PN>, ...any] extends [...FixedLengthArray<PM>, ...any]
            ? Negate<Exclude<NaturalNumbersFrom0Through<PN>, NaturalNumbersFrom0Until<PM>>>
            : Negate<Exclude<NaturalNumbersFrom0Through<PM>, NaturalNumbersFrom0Until<PN>>>
          : Negate<NaturalNumbersFrom0Through<PN>> | NaturalNumbersFrom0Through<M>
        : `${M}` extends `-${infer PM extends number}`
        ? NaturalNumbersFrom0Through<N> | Negate<NaturalNumbersFrom0Through<PM>>
        : [...FixedLengthArray<N>, ...any] extends [...FixedLengthArray<M>, ...any]
        ? Exclude<NaturalNumbersFrom0Through<N>, NaturalNumbersFrom0Until<M>>
        : Exclude<NaturalNumbersFrom0Through<M>, NaturalNumbersFrom0Until<N>>
      : IntegerRangeThrough<0, N>
    : never
  : never

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type DigitToRangeUntil<D extends Digit> = D extends '0'
  ? never
  : D extends '1'
  ? '0'
  : D extends '2'
  ? '0' | '1'
  : D extends '3'
  ? '0' | '1' | '2'
  : D extends '4'
  ? '0' | '1' | '2' | '3'
  : D extends '5'
  ? '0' | '1' | '2' | '3' | '4'
  : D extends '6'
  ? '0' | '1' | '2' | '3' | '4' | '5'
  : D extends '7'
  ? '0' | '1' | '2' | '3' | '4' | '5' | '6'
  : D extends '8'
  ? '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7'
  : D extends '9'
  ? '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  : never

/**
 * Generate a union type from 0 to the given number minus 1. It's orders of magnitude faster compared to a naive implementation.
 * @example
 * NaturalNumbersFrom0Until<0> is equivalent to never
 * NaturalNumbersFrom0Until<1> is equivalent to 0
 * NaturalNumbersFrom0Until<2> is equivalent to 0 | 1
 * NaturalNumbersFrom0Until<10000> is equivalent to 0 | 1 | 2 | ... | 9999
 */
export type NaturalNumbersFrom0Until<N extends number> = ToNumber<_NaturalNumbersFrom0Until<ToDigitArray<N>>>
type _NaturalNumbersFrom0Until<DigitArray extends readonly Digit[]> = DigitArray extends readonly [
  infer D extends Digit
]
  ? `${DigitToRangeUntil<D>}`
  : DigitArray extends readonly [infer H extends Digit, ...infer L extends readonly Digit[]]
  ?
      | `${DigitToRangeUntil<H>}${RepeatString<Digit, L['length']> extends infer S extends string ? S : never}`
      | `${H}${_NaturalNumbersFrom0Until<L>}`
  : ''

/**
 * Generate a union type from 0 to the given number. It's orders of magnitude faster compared to a naive implementation.
 * @example
 * NaturalNumbersFrom0Through<0> is equivalent to 0
 * NaturalNumbersFrom0Through<1> is equivalent to 1
 * NaturalNumbersFrom0Through<2> is equivalent to 0 | 1 | 2
 * NaturalNumbersFrom0Through<10000> is equivalent to 0 | 1 | 2 | ... | 10000
 */
export type NaturalNumbersFrom0Through<N extends number> = NaturalNumbersFrom0Until<N> | N

export function isInIntegerRangeUntil<N extends number, M extends number>(
  value: number,
  n: N,
  m: M
): value is IntegerRangeUntil<N, M> {
  return Number.isInteger(value) && n <= value && value < m
}
export namespace isInIntegerRangeUntil {
  /**
   * filter(someNumbers, isInIntegerRangeUntil.chain(0, 5))
   */
  export function chain<N extends number, M extends number>(
    n: N,
    m: M
  ): (value: number) => value is IntegerRangeUntil<N, M> {
    return (value): value is IntegerRangeUntil<N, M> => isInIntegerRangeUntil(value, n, m)
  }
}

export function isInIntegerRangeThrough<N extends number, M extends number>(
  value: number,
  n: N,
  m: M
): value is IntegerRangeThrough<N, M> {
  return Number.isInteger(value) && n <= value && value <= m
}
export namespace isInIntegerRangeThrough {
  export function chain<N extends number, M extends number>(
    n: N,
    m: M
  ): (value: number) => value is IntegerRangeThrough<N, M> {
    return (value): value is IntegerRangeThrough<N, M> => isInIntegerRangeThrough(value, n, m)
  }
}

/**
 * @example
 * randomIntegerUntil(3) returns 0, 1 or 2
 * randomIntegerUntil(3) is typed as 0 | 1 | 2
 * randomIntegerUntil(1, 4) returns 1, 2 or 3
 * randomIntegerUntil(1, 4) is typed as 1 | 2 | 3
 * @example
 * randomIntegerUntil(-2) returns 0 or -1
 * randomIntegerUntil(-2) is typed as 0 | -1
 * @example
 * randomIntegerUntil(0) throws RangeError
 * randomIntegerUntil(0) is typed as never
 * randomIntegerUntil(5, 5) throws RangeError
 * randomIntegerUntil(5, 5) is typed as never
 */
export function randomIntegerUntil<To extends number>(to: To): IntegerRangeUntil<To>
export function randomIntegerUntil<From extends number, To extends number>(
  from: From,
  to: To
): IntegerRangeUntil<From, To>
export function randomIntegerUntil<N extends number, M extends number>(first: N, second?: M): number {
  const [from, to] = second === undefined ? [0, first] : [first, second]
  if (from === to) {
    throw RangeError(`The arguments of randomIntegerUntil are the same value(${to}).\nMust be different values.`)
  }
  return Math.trunc(Math.random() * (to - from)) + from
}

export function randomIntegerThrough<N extends number>(end: N): IntegerRangeThrough<N>
export function randomIntegerThrough<N extends number, M extends number>(start: N, end: M): IntegerRangeThrough<N, M>
export function randomIntegerThrough<N extends number, M extends number>(first: N, second?: M): number {
  const from = second === undefined ? 0 : first
  const to = second === undefined ? first : second
  return Math.trunc(Math.random() * (to + 1 - from)) + from
}

/**
 * The clamp function restricts a given input value to a specified range or interval, by constraining it to a minimum and maximum value.
 * If the input value is within the specified range, the function returns the input value itself.
 * However, if the input value is outside of the specified range, the function returns the nearest boundary value that it is constrained to.
 *
 * @example
 * clamp(0, 50, 100) returns 50
 * clamp(0, 110, 100) returns 100
 * clamp(0, -20, 100) returns 0
 * @example
 * clamp(0, Infinity, 100) returns 100
 * clamp(0, -Infinity, 100) returns 0
 * @example
 * clamp(0, 50, Infinity) returns 50
 * clamp(-Infinity, 50, 100) returns 50
 */
export function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * Function to calculate modulo instead of reminder.
 * Unlike the % operator, the modOf function handles negative numbers differently, such that the result has the same sign as the divisor.
 *
 * @example
 * modOf(4, 3) returns 1
 * modOf(3, 3) returns 0
 * modOf(2, 3) returns 2
 * modOf(1, 3) returns 1
 * modOf(0, 3) returns 0
 * modOf(-1, 3) returns 2
 * modOf(-2, 3) returns 1
 * modOf(-3, 3) returns 0
 * modOf(-4, 3) returns 2
 * @example
 * modOf(4, -3) returns -2
 * modOf(3, -3) returns -0
 * modOf(2, -3) returns -1
 * modOf(1, -3) returns -2
 * modOf(0, -3) returns -0
 * modOf(-1, -3) returns -1
 * modOf(-2, -3) returns -2
 * modOf(-3, -3) returns -0
 * modOf(-4, -3) returns -1
 * @example
 * modOf(3.5, 2) returns 1.5
 * modOf(0.5, 0.2) returns 0.09999999999999998
 * @example
 * modOf(Infinity, 2) returns NaN
 * modOf(9, Infinity) returns NaN
 */
export function modOf<const N extends number, const M extends number>(a: N, b: M): ModOf<N, M> {
  return (((a % b) + b) % b) as any
}
export type ModOf<N extends number, M extends number> = IsInteger<N> extends false
  ? number
  : IsInteger<M> extends false
  ? number
  : IntegerRangeUntil<M>

/**
 * Round off to the n-th decimal place.
 * @example
 * roundAt(0.123, 2) returns 0.12
 * roundAt(0.123, 1) returns 0.1
 * roundAt(3.14159, 3) returns 3.142
 * roundAt(12345, -1) returns 12350
 * roundAt(12345, -2) returns 12300
 */
export function roundAt(value: number, nthDecimalPlace: number): number {
  const factor = Math.pow(10, nthDecimalPlace)
  return Math.round(value * factor) / factor
}

export function factorialOf(n: number): number {
  if (!Number.isInteger(n)) return NaN
  if (n < 0) return NaN

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

export function gcdOf(...values: ReadonlyNonEmptyArray<number>): number {
  const [first, ...rest] = values
  let result = first
  for (const value of rest) {
    result = binaryGcdOf(result, value)
  }
  return result
}
function binaryGcdOf(a: number, b: number): number {
  if (b === 0) return a

  return binaryGcdOf(b, a % b)
}

/**
 * Determines whether a given number is a prime number using the wheel factorization method with the base 2-3-5-7.
 *
 * @example
 * isPrimeNumber(2) returns true
 * isPrimeNumber(3) returns true
 * isPrimeNumber(4) returns false
 * @example
 * isPrimeNumber(-1) returns false
 * isPrimeNumber(0) returns false
 * isPrimeNumber(1) returns false
 * isPrimeNumber(2.5) returns false
 * isPrimeNumber(Infinite) returns false
 */
export function isPrimeNumber(n: number): boolean {
  if (n <= 1 || !Number.isFinite(n) || !Number.isInteger(n)) return false

  const BASE_PRIME_NUMBERS = [2, 3, 5, 7] as const
  const WHEEL = [
    2, 4, 2, 4, 6, 2, 6, 4, 2, 4, 6, 6, 2, 6, 4, 2, 6, 4, 6, 8, 4, 2, 4, 2, 4, 8, 6, 4, 6, 2, 4, 6, 2, 6, 6, 4, 2, 4, 6,
    2, 6, 4, 2, 4, 2, 10, 2, 10,
  ] as const

  if (includes(BASE_PRIME_NUMBERS, n)) return true

  if (BASE_PRIME_NUMBERS.some((p) => n % p === 0)) return false

  let i = 11
  let c = 0
  const upperBound = Math.sqrt(n) + 1
  while (i < upperBound) {
    if (n % i === 0) return false

    i += WHEEL[c % WHEEL.length]!
    c++
  }
  return true
}
