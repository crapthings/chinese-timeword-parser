const moment = require('moment')

const {
  CJK_SYMBOLS_AND_PUNCTUATION,
  CJK_UNIFIED_IDEOGRAPHS,
  HALFWIDTH_AND_FULLWIDTH_FORMS,
  TIMEWORD,
} = require('./mapping')

const MATCH_PATTERN1 = /([头前后])?([\d]+)([年])?([的])?([第])?([到至~])?([\d]+)?([个])?(.*)?([年月周][初末底头尾]|季度|星期|[年月日天周])([之])?([前后内])?/

// 2018年第一季度
const MATCH_PATTERN2 = /([\d]+)([年])([的])?([第])?([\d]+)([个])?([月周天]|季度)([前后内])?/

function parse(str) {
  const pre = preProcess(str)
  const post = postProcess(pre)
  const match = post.match(MATCH_PATTERN1)

  // console.log(JSON.stringify(match, null, 2), '\n')

  let value = match[2]
  const token = TIMEWORD[match[10]]
  const directionality = TIMEWORD[match[1]] || TIMEWORD[match[12]]

  if (token === 'start of a year')
    value = moment(new Date(value)).startOf('year').format('YYYY-M-D')

  if (token === 'end of a year')
    value = moment(new Date(value)).endOf('year').format('YYYY-M-D')

  const result = {}

  if (directionality) result.directionality = directionality
  if (token) result.token = token

  if (value && match[7] && !match[3] && !match[4] && !match[5]) {
    result.from = value
    result.to = match[7]
  }

  if (value && !match[7]) {
    result.value = value
  }

  if (match[2] && match[3] && match[7] && match[10] && !directionality) {
    result.from = moment(new Date(match[2])).quarter(parseInt(match[7])).format('YYYY-M-D')
    result.to = moment(new Date(match[2])).quarter(parseInt(match[7]) + 1).subtract(1, 'd').format('YYYY-M-D')
    result.quarter = match[7]
  }

  if (match[2] && match[3] && match[7] && match[10] && directionality) {
    if (directionality == 'before')
      result.value = moment(new Date(match[2])).quarter(parseInt(match[7])).subtract(1, 'd').format('YYYY-M-D')
    if (directionality == 'after')
      result.value = moment(new Date(match[2])).quarter(parseInt(match[7]) + 1).format('YYYY-M-D')
    result.year = match[2]
    result.quarter = match[7]
  }

  // console.log(result)

  return result
}

function preProcess(ctx) {
  const chars = ctx.replace(/\s/g, '').split('')
  const result = []
  for (const idx in chars) {
    const char = chars[idx]
    if (char == '十' || char == '百') {
      const leftChar = CJK_UNIFIED_IDEOGRAPHS[chars[parseInt(idx) - 1]]
      const rightChar = CJK_UNIFIED_IDEOGRAPHS[chars[parseInt(idx) + 1]]
      if (leftChar && !rightChar) result.push('0')
      if (!leftChar && rightChar) result.push('1')
      if (!leftChar && !rightChar) result.push(char)
    } else {
      result.push(char)
    }
  }
  return result
}

function postProcess(ctx) {
  const result = ctx
  for (const idx in result) {
    const char = result[idx]
    result[idx] = CJK_SYMBOLS_AND_PUNCTUATION[char]
      || CJK_UNIFIED_IDEOGRAPHS[char]
      || HALFWIDTH_AND_FULLWIDTH_FORMS[char]
      || char
  }
  return result.join('')
}

function isBefore(dateA, dateB) {
  const a = parse(dateA)
  const b = parse(dateB)
  return moment(new Date(a.value)).isBefore(new Date(b.value))
}

function isAfter(dateA, dateB) {
  const a = parse(dateA)
  const b = parse(dateB)
  return moment(new Date(a.value)).isAfter(new Date(b.value))
}

function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]'
}

module.exports = {
  parse,
  isBefore,
  isAfter,
  compare: isBefore,
}
