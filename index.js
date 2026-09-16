const { CHARS, normalize, number } = require('./lib/numbers')
const { TIMEWORD_DICT } = require('./mapping')
const N = `[${CHARS}]{1,16}`
const SOURCE = `(?<year>[${CHARS}]{1,16})年(?:的)?(?:第)?(?<quarter>${N})(?:个)?(?:季度|季)(?<qd>[前后内])?|(?<boundaryYear>${N})(?<boundary>年初|年头|年末|年底|年尾)(?<bd>[前后内])?|(?<prefix>[头前后])?(?<amount>${N})(?:[ \t]*(?:到|至|~|～|-)[ \t]*(?<end>${N}))?[ \t]*(?:个)?(?<unit>工作日|季度|星期|年|月|日|天|周|季)(?<suffix>[前后内])?`
const ADJACENT = new RegExp(`[${CHARS}万亿萬億A-Za-z_./:：负負+＋−－-]`)
function date(year, month, day) { return `${year}-${month}-${day}` }
function previous(year, month) {
  if (month === 1) return date(year - 1, 12, 31)
  return date(year, month - 1, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 2])
}
function convert(g) {
  if (g.year || g.boundaryYear) {
    const rawYear = normalize(g.year || g.boundaryYear)
    const year = Number(rawYear)
    if (!/^\d{4}$/.test(rawYear) || year < 1 || year > 9999) return
    if (g.boundary) {
      const result = { token: TIMEWORD_DICT[g.boundary], value: date(year, g.boundary === '年初' || g.boundary === '年头' ? 1 : 12, g.boundary === '年初' || g.boundary === '年头' ? 1 : 31) }
      if (g.bd) result.directionality = TIMEWORD_DICT[g.bd]
      return result
    }
    const quarter = number(g.quarter)
    if (quarter < 1 || quarter > 4 || !Number.isInteger(quarter)) return
    const month = (quarter - 1) * 3 + 1
    const result = { token: 'quarters', quarter: String(quarter) }
    if (g.qd === '前' || g.qd === '后') {
      if ((year === 1 && quarter === 1 && g.qd === '前') || (year === 9999 && quarter === 4 && g.qd === '后')) return
      result.directionality = TIMEWORD_DICT[g.qd]
      result.year = String(year)
      result.value = g.qd === '前' ? previous(year, month) : date(quarter === 4 ? year + 1 : year, quarter === 4 ? 1 : month + 3, 1)
    } else {
      result.from = date(year, month, 1)
      result.to = date(year, month + 2, quarter === 1 || quarter === 4 ? 31 : 30)
      if (g.qd) result.directionality = TIMEWORD_DICT[g.qd]
    }
    return result
  }
  const amount = number(g.amount), end = g.end === undefined ? undefined : number(g.end)
  if (!Number.isSafeInteger(amount) || (end !== undefined && (!Number.isSafeInteger(end) || end < amount))) return
  if (g.prefix && g.suffix && TIMEWORD_DICT[g.prefix] !== TIMEWORD_DICT[g.suffix]) return
  const result = { token: g.unit === '工作日' ? 'days' : TIMEWORD_DICT[g.unit] }
  if (g.prefix || g.suffix) result.directionality = TIMEWORD_DICT[g.prefix || g.suffix]
  if (end === undefined) result.value = String(amount)
  else { result.from = String(amount); result.to = String(end) }
  return result
}
function* scan(text) {
  if (typeof text !== 'string') return
  const pattern = new RegExp(SOURCE, 'g')
  for (const match of text.matchAll(pattern)) {
    const end = match.index + match[0].length
    if (ADJACENT.test(text[match.index - 1] || '') || ADJACENT.test(text[end] || '')) continue
    // Do not reinterpret a fragment of an invalid calendar expression.
    if (/[年月]/.test(text[match.index - 1] || '') || /[年月日号第]/.test(text[end] || '')) continue
    const result = convert(match.groups)
    if (result) yield { ...result, text: match[0], index: match.index }
  }
}
function parseAll(text) { return Array.from(scan(text)) }
function parse(text) {
  const match = scan(text).next().value
  if (!match) return undefined
  const { text: original, index, ...result } = match
  return result
}
function comparable(text) {
  const result = parse(text)
  if (!result || !/^\d+-\d+-\d+$/.test(result.value || '')) throw new TypeError('Comparison requires a timeword that resolves to a single calendar date')
  const [year, month, day] = result.value.split('-').map(Number)
  return year * 10000 + month * 100 + day
}
function compare(a, b) { return Math.sign(comparable(a) - comparable(b)) }
function isBefore(a, b) { return compare(a, b) === -1 }
function isAfter(a, b) { return compare(a, b) === 1 }
function isSame(a, b) { return compare(a, b) === 0 }
module.exports = { parse, parseAll, compare, isBefore, isAfter, isSame }
