const nodeTest = require('node:test')
const assert = require('node:assert/strict')
const test = (name, fn) => nodeTest(name, () => fn({ is: assert.strictEqual }))

const {
  parse,
  isBefore,
  isAfter,
  isSame,
  compare,
} = require('./')

test('十日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('十日内')
  is(directionality, 'between')
  is(value, '10')
  is(token, 'days')
})

test('二十五天后', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('二十五天后')
  is(directionality, 'after')
  is(value, '25')
  is(token, 'days')
})

test('五天前', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('五天前')
  is(directionality, 'before')
  is(value, '5')
  is(token, 'days')
})

test('十五日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('十五日内')
  is(directionality, 'between')
  is(value, '15')
  is(token, 'days')
})

test('二十日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('二十日内')
  is(directionality, 'between')
  is(value, '20')
  is(token, 'days')
})

test('二十五日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('二十五日内')
  is(directionality, 'between')
  is(value, '25')
  is(token, 'days')
})

test('二百二十五日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('二百二十五日内')
  is(directionality, 'between')
  is(value, '225')
  is(token, 'days')
})

test('十五个工作日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('十五个工作日内')
  is(directionality, 'between')
  is(value, '15')
  is(token, 'days')
})

test('2020年初', ({ pass, fail, is }) => {
  const { value, token } = parse('2020年初')
  is(value, '2020-1-1')
  is(token, 'start of a year')
})

test('2018年末', ({ pass, fail, is }) => {
  const { value, token } = parse('2018年末')
  is(value, '2018-12-31')
  is(token, 'end of a year')
})

test('头15天', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('头15天')
  is(directionality, 'before')
  is(value, '15')
  is(token, 'days')
})

test('前三周', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('前三周')
  is(directionality, 'before')
  is(value, '3')
  is(token, 'weeks')
})

test('两周后', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('两周后')
  is(directionality, 'after')
  is(value, '2')
  is(token, 'weeks')
})

test('一个星期内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('一个星期内')
  is(directionality, 'between')
  is(value, '1')
  is(token, 'weeks')
})

test('三到五天内', ({ pass, fail, is }) => {
  const { directionality, from, to, token } = parse('三到五天内')
  is(directionality, 'between')
  is(from, '3')
  is(to, '5')
  is(token, 'days')
})

test('5 ~ 7天内', ({ pass, fail, is }) => {
  const { directionality, from, to, token } = parse('5 ~ 7天内')
  is(directionality, 'between')
  is(from, '5')
  is(to, '7')
  is(token, 'days')
})

test('需要在一个季度内完成', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('需要在一个季度内完成')
  is(directionality, 'between')
  is(value, '1')
  is(token, 'quarters')
})

test('2018年第一季度', ({ pass, fail, is }) => {
  const { from, to, quarter, token } = parse('2018年第一季度')
  is(from, '2018-1-1')
  is(to, '2018-3-31')
  is(quarter, '1')
  is(token, 'quarters')
})

test('2018年第二季度', ({ pass, fail, is }) => {
  const { from, to, quarter, token } = parse('2018年第二季度')
  is(from, '2018-4-1')
  is(to, '2018-6-30')
  is(quarter, '2')
  is(token, 'quarters')
})

test('2018年第二季度前', ({ pass, fail, is }) => {
  const { directionality, value, year, quarter, token } = parse('2018年第二季度前')
  is(directionality, 'before')
  is(value, '2018-3-31')
  is(year, '2018')
  is(quarter, '2')
  is(token, 'quarters')
})

test('2018年第二季度前 2017年第3季度后', ({ pass, fail, is }) => {
  const dateA = parse('2018年第二季度前')
  const dateB = parse('2017年第3季度后')
  is(dateA.directionality, 'before')
  is(dateA.value, '2018-3-31')

  is(dateB.directionality, 'after')
  is(dateB.value, '2017-10-1')

  is(compare('2018年第二季度前', '2017年第3季度后'), 1)
})

test('二零一八年第二季度前 2020年第3季度后', ({ pass, fail, is }) => {
  const dateA = parse('二零一八年第二季度前')
  const dateB = parse('2020年第3季度后')
  is(dateA.directionality, 'before')
  is(dateA.value, '2018-3-31')

  is(dateB.directionality, 'after')
  is(dateB.value, '2020-10-1')

  is(compare('二零一八年第二季度前', '2020年第3季度后'), -1)
})

test('二零一八年底 ２０１８年末', ({ pass, fail, is }) => {
  const dateA = parse('二零一八年底')
  const dateB = parse('２０１８年末')
  is(dateA.value, '2018-12-31')
  is(dateB.value, '2018-12-31')

  is(compare('二零一八年底', '２０１８年末'), 0)
})

nodeTest('original text and UTF-16 offsets', () => {
  const { parseAll } = require('./')
  const text = '😀三到五天内，２０１８年第四季度后，两周后'
  const matches = parseAll(text)
  assert.equal(matches.length, 3)
  for (const match of matches) assert.equal(text.slice(match.index, match.index + match.text.length), match.text)
  assert.equal(matches[0].index, 2)
  assert.equal(matches[1].value, '2019-1-1')
})
nodeTest('invalid input and candidates are skipped', () => {
  const { parseAll } = require('./')
  for (const input of [null, undefined, 42, {}, '', '没有时间词', '2018年第五季度', '0000年初', '0001年第一季度前', '9999年第四季度后', '五到三天内', '十百日内', '二百五日内', '前五天后', 'v2020年初', '2026年9月16日']) {
    assert.equal(parse(input), undefined, String(input))
    assert.deepEqual(parseAll(input), [], String(input))
  }
  assert.equal(parse('2018年第五季度，十天后').value, '10')
})
nodeTest('numerals and zero gaps', () => {
  for (const [text, value] of [['零', 0], ['十', 10], ['一十', 10], ['二百零五', 205], ['一千零一', 1001], ['一千零二十', 1020], ['一千二百三十四', 1234], ['００５', 5]]) {
    assert.equal(parse(text + '日内').value, String(value))
  }
})
nodeTest('all calendar quarter boundaries across Gregorian cycle', () => {
  for (let year = 2000; year < 2400; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const result = parse(`${year}年第${quarter}季度`)
      const end = new Date(Date.UTC(year, quarter * 3, 0))
      assert.equal(result.to, `${year}-${end.getUTCMonth() + 1}-${end.getUTCDate()}`)
      assert.equal(result.from, `${year}-${(quarter - 1) * 3 + 1}-1`)
    }
  }
})
nodeTest('comparisons reject durations and intervals', () => {
  assert.equal(isBefore('2018年初', '2018年末'), true)
  assert.equal(isAfter('2018年末', '2018年初'), true)
  assert.equal(isSame('二零一八年底', '2018年末'), true)
  for (const input of ['五天后', '三到五天内', '2018年第一季度', '无效', null]) assert.throws(() => compare(input, '2018年初'), TypeError)
})
nodeTest('long input and isolated scanning cursors', () => {
  const { parseAll } = require('./')
  assert.deepEqual(parseAll('一'.repeat(100000) + '日内'), [])
  assert.equal(parseAll('十天后，两周后').length, 2)
  assert.equal(parseAll('十天后，两周后').length, 2)
})

nodeTest('unsupported numbers cannot produce suffix matches', () => {
  for (const text of ['一万五天后', '一亿两周后', '-5天后', '负五天后', '1.5天后', '2026/9/16日']) {
    assert.equal(parse(text), undefined, text)
  }
})
nodeTest('zero gaps following multiple units', () => {
  assert.equal(parse('一千二百零五天后').value, '1205')
  assert.equal(parse('一千零二十天后').value, '1020')
  for (const text of ['一千二百五', '一千零二百', '一千二百零', '二百零零五']) assert.equal(parse(text + '天后'), undefined, text)
})

nodeTest('horizontal whitespace preserves text without merging lines', () => {
  const { parseAll } = require('./')
  assert.equal(parse('三 \t到 五 天内').from, '3')
  const matches = parseAll('三天后\n五天内')
  assert.equal(matches.length, 2)
  assert.equal(matches[1].index, 4)
  assert.equal(parse('3\n到5天内').from, undefined)
})
nodeTest('all canonical Chinese quantities below ten thousand', () => {
  const digits = '零一二三四五六七八九'
  for (let n = 1; n < 10000; n++) {
    const places = String(n).split('').map(Number)
    const units = ['', '十', '百', '千']
    let chinese = '', zero = false
    for (let i = 0; i < places.length; i++) {
      const digit = places[i]
      if (!digit) { if (chinese) zero = true; continue }
      if (zero) chinese += '零'
      chinese += digits[digit] + units[places.length - i - 1]
      zero = false
    }
    chinese = chinese.replace(/^一十/, '十')
    assert.equal(parse(chinese + '天内').value, String(n), chinese)
  }
})
