const moment = require('moment')

const CJK_SYMBOLS_AND_PUNCTUATION = {
  '〇': '0',
}

const CJK_UNIFIED_IDEOGRAPHS = {
  '零': '0',
  '一': '1',
  '二': '2',
  '三': '3',
  '四': '4',
  '五': '5',
  '六': '6',
  '七': '7',
  '八': '8',
  '九': '9',
  '十': '10',

  '两': '2',
}

const HALFWIDTH_AND_FULLWIDTH_FORMS = {
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
}

const TIMEWORD = {
  '年': 'years',
  '月': 'months',
  '日': 'days',
  '天': 'days',
  '周': 'weeks',
  '前': 'before',
  '后': 'after',
  '头': 'before',
  '内': 'between',
  '季': 'quarters',
  '季度': 'quarters',
  '星期': 'weeks',
  '年初': 'start of a year',
  '年底': 'end of a year',
  '年末': 'end of a year',
  '年尾': 'end of a year',
}

module.exports = {
  CJK_SYMBOLS_AND_PUNCTUATION,
  CJK_UNIFIED_IDEOGRAPHS,
  HALFWIDTH_AND_FULLWIDTH_FORMS,
  TIMEWORD,
}
