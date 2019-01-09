const test = require('ava')

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

function log(ctx) {
  console.log(JSON.stringify(ctx, null, 2), '\n')
}
