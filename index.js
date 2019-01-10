const moment = require('moment')

const {
  NUMERIC_DICT,
  TIMEWORD_DICT,
} = require('./mapping')

const MATCH_PATTERN = /([头前后])?([\d]+)([年])?([的])?([第])?([到至~])?([\d]+)?([个])?(.*)?([年月周][初末底头尾]|季度|季|星期|[年月日天周])([之])?([前后内])?/

function parse(str) {
  const pre = preProcess(str)
  const post = postProcess(pre)
  const match = post.match(MATCH_PATTERN)

  let value = match[2]
  const token = TIMEWORD_DICT[match[10]]
  const directionality = TIMEWORD_DICT[match[1]] || TIMEWORD_DICT[match[12]]

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

function preProcess(str) {
  const chars = str.replace(/\s/g, '').split('')
  const result = []
  for (const idx in chars) {
    const char = chars[idx]
    if (char == '十' || char == '百') {
      const leftChar = NUMERIC_DICT[chars[parseInt(idx) - 1]]
      const rightChar = NUMERIC_DICT[chars[parseInt(idx) + 1]]
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
  const result = clone(ctx)
  for (const idx in result) {
    const char = result[idx]
    result[idx] = NUMERIC_DICT[char]
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

function isSame(dateA, dateB) {
  const a = parse(dateA)
  const b = parse(dateB)
  return moment(new Date(a.value)).isSame(new Date(b.value))
}

function compare(dateA, dateB) {
  const a = parse(dateA)
  const b = parse(dateB)

  if (moment(new Date(a.value)).isSame(new Date(b.value)))
    return 0

  if (moment(new Date(a.value)).isBefore(new Date(b.value)))
    return -1

  if (moment(new Date(a.value)).isAfter(new Date(b.value)))
    return 1
}

function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]'
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  parse,
  isBefore,
  isAfter,
  isSame,
  compare,
}
