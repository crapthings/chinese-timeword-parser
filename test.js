const test = require('ava')

const {
  parse,
  parseWith,
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

function log(ctx) {
  console.log(JSON.stringify(ctx, null, 2), '\n')
}
