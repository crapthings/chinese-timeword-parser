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

test('十五日内', ({ pass, fail }) => {
  const date = parse('十五日内')
  log(date)
  date ? pass() : fail()
})

test('二十日内', ({ pass, fail }) => {
  const date = parse('二十日内')
  log(date)
  date ? pass() : fail()
})

test('二十五日内', ({ pass, fail }) => {
  const date = parse('二十五日内')
  log(date)
  date ? pass() : fail()
})

test('二百二十五日内', ({ pass, fail }) => {
  const date = parse('二百二十五日内')
  log(date)
  date ? pass() : fail()
})

test('十五个工作日内', ({ pass, fail, is }) => {
  const { directionality, value, token } = parse('十五个工作日内')
  is(directionality, 'between')
  is(value, '15')
  is(token, 'days')
})

test('2020年初', ({ pass, fail }) => {
  const date = parse('2020年初')
  log(date)
  date ? pass() : fail()
})

test('2018年末', ({ pass, fail }) => {
  const date = parse('2018年末')
  log(date)
  date ? pass() : fail()
})

test('头15天', ({ pass, fail }) => {
  const date = parse('头15天')
  log(date)
  date ? pass() : fail()
})

test('前三周', ({ pass, fail }) => {
  const date = parse('前三周')
  log(date)
  date ? pass() : fail()
})

test('两周后', ({ pass, fail }) => {
  const date = parse('两周后')
  log(date)
  date ? pass() : fail()
})

test('一个星期内', ({ pass, fail }) => {
  const date = parse('一个星期内')
  log(date)
  date ? pass() : fail()
})

// test.todo('提交的前一天得到结果')

// test.todo('将在裁定后的15天之内给出结果')

function log(ctx) {
  console.log(JSON.stringify(ctx, null, 2), '\n')
}
