const moment = require('moment')

const {
  CJK_SYMBOLS_AND_PUNCTUATION,
  CJK_UNIFIED_IDEOGRAPHS,
  HALFWIDTH_AND_FULLWIDTH_FORMS,
  TIMEWORD,
} = require('./mapping')

const MATCH_PATTERN = /([头前后])?([\d]+)([个])?(.*)?([年月周][初末底头尾]|季度|星期|[年月日天周])([之])?([前后内])?/

function parse(str) {
  const pre = preProcess(str)
  const post = postProcess(pre)
  const match = post.match(MATCH_PATTERN)

  // log(match)

  let value = match[2]
  const token = TIMEWORD[match[5]]
  const directionality = TIMEWORD[match[1]] || TIMEWORD[match[7]]

  if (token === 'start of a year')
    value = moment(new Date(value)).startOf('year').format('YYYY-M-D')

  if (token === 'end of a year')
    value = moment(new Date(value)).endOf('year').format('YYYY-M-D')

  return {
    directionality,
    value,
    token,
  }
}

function preProcess(ctx) {
  const chars = ctx.split('')
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

function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]'
}

function log(ctx) {
  console.log(JSON.stringify(ctx, null, 2), '\n')
}

module.exports = {
  parse,
}
