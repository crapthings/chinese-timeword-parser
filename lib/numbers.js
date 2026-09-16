const DIGITS = { '〇': '0', '零': '0', '一': '1', '二': '2', '两': '2', '三': '3', '四': '4', '五': '5', '六': '6', '七': '7', '八': '8', '九': '9' }
const CHARS = '0-9０-９〇零一二两三四五六七八九十百千'
function normalize(text) {
  return text.replace(/[０-９〇零一二两三四五六七八九]/g, c => DIGITS[c] ?? String(c.charCodeAt(0) - 0xff10))
}
function number(text) {
  const value = normalize(text)
  if (/^\d+$/.test(value)) return Number.isSafeInteger(Number(value)) ? Number(value) : NaN
  // Multiplicative numerals, with descending units and explicit zero gaps.
  if (!/^[〇零一二两三四五六七八九十百千]+$/.test(text)) return NaN
  const units = { '十': 10, '百': 100, '千': 1000 }
  let total = 0, last = 10000, rest = value
  while (/[十百千]/.test(rest)) {
    const match = /^([1-9]?)([十百千])/.exec(rest)
    if (!match || (!match[1] && (total !== 0 || match[2] !== '十'))) return NaN
    const unit = units[match[2]]
    if (unit >= last) return NaN
    total += Number(match[1] || 1) * unit
    last = unit
    rest = rest.slice(match[0].length).replace(/^0/, '')
  }
  if (rest && !/^[1-9]$/.test(rest)) return NaN
  const result = total + Number(rest || 0)
  let canonical = '', gap = false
  for (const unit of [1000, 100, 10, 1]) {
    const digit = Math.floor(result / unit) % 10
    if (digit) {
      if (gap) canonical += '0'
      canonical += String(digit) + ({ 1000: '千', 100: '百', 10: '十', 1: '' }[unit])
      gap = false
    } else if (canonical) gap = true
  }
  if (canonical.startsWith('1十')) canonical = canonical.slice(1)
  return (value === canonical || (canonical.startsWith('十') && value === '1' + canonical)) ? result : NaN
}
module.exports = { CHARS, normalize, number }
