export type Directionality = 'before' | 'after' | 'between'
export type TimewordToken = 'years' | 'months' | 'days' | 'weeks' | 'quarters' | 'start of a year' | 'end of a year'
export interface ParseResult {
  token: TimewordToken
  directionality?: Directionality
  /** Decimal amount or unpadded YYYY-M-D calendar date. */
  value?: string
  from?: string
  to?: string
  year?: string
  quarter?: string
}
export interface TimewordMatch extends ParseResult {
  text: string
  /** Zero-based UTF-16 offset in the original input. */
  index: number
}
export function parse(text: unknown): ParseResult | undefined
export function parseAll(text: unknown): TimewordMatch[]
/** Throws TypeError unless both inputs resolve to a single calendar date. */
export function compare(a: unknown, b: unknown): -1 | 0 | 1
export function isBefore(a: unknown, b: unknown): boolean
export function isAfter(a: unknown, b: unknown): boolean
export function isSame(a: unknown, b: unknown): boolean
