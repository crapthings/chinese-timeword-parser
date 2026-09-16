# chinese-timeword-parser

从中文文本中提取时间词、期限、方向和范围，以及明确年份的年初、年末和季度。无运行时依赖，附带 TypeScript 声明，需要 Node.js 18 或更高版本。

## 使用

```js
const { parse, parseAll, compare } = require('@crapthings/chinese-timeword-parser')

parse('需要在二百零五日内完成')
// { token: 'days', directionality: 'between', value: '205' }

parse('三到五天内')
// { token: 'days', directionality: 'between', from: '3', to: '5' }

parse('2018年第二季度')
// { token: 'quarters', quarter: '2', from: '2018-4-1', to: '2018-6-30' }

parseAll('期限十日内，复盘两周后')
// [
//   { token: 'days', directionality: 'between', value: '10', text: '十日内', index: 2 },
//   { token: 'weeks', directionality: 'after', value: '2', text: '两周后', index: 9 }
// ]

compare('2018年第二季度前', '2017年第3季度后') // 1
parse('没有时间词') // undefined
```

`parse(text)` 返回第一个有效匹配，保留旧版字段及字符串数值格式。没有匹配或输入不是字符串时返回 `undefined`。

`parseAll(text)` 按原文顺序返回全部有效匹配，额外包含 `text` 和零起始 UTF-16 偏移 `index`；无匹配时返回 `[]`。无效候选会跳过，继续查找后文。匹配保留原字符，不对全文做数字转换或删除空格。

## 支持范围

- 数量单位：年、月、日、天、周、星期、季、季度；允许单位前的「个」。
- 方向：前、后、头作为前缀；前、后、内作为后缀。`头` 对应 `before`，`内` 对应 `between`。冲突方向会被拒绝。
- 数量范围：到、至、`~`、`～`、`-`；允许分隔符及单位前有空格或制表符，不跨行拼接范围。范围必须递增或相等。
- 数字：半角、全角、中文逐位数字（含零、〇、两），以及规范的十、百、千组合，如「二百零五」「一千二百三十四」。不接受含糊的「二百五」、万亿、小数、负数和超出安全整数范围的数量，也不会从这些表达式中提取尾部数量。单个数字候选最多 16 个字符。
- 年初、年头、年末、年底、年尾：必须带四位逐位年份，范围 0001–9999，返回不补零的 `YYYY-M-D`。
- 明确年份的季度：`2018年第二季度`、`2018年的第2季`、`2018年2季度`；季度必须为 1–4。季度前返回上一天，季度后返回下一季度首日；跨出年份支持范围时拒绝。季度内返回该季度的起止日期及 `between`。

`工作日` 为兼容旧版仍返回 `days`，不计算节假日或工作日历。相对期限仅返回数量与方向，不依赖当前时间、不换算实际日期。「今天」「明天」「下周三」、单独的「年初」及明确年月日不在本库的解析范围。边界规则排除相邻数字和英文标识符，并避免从常见完整日期截取月、日片段；规则提取不能判断所有自然语言语义。

## 比较

`compare(a, b)` 返回 `-1 | 0 | 1`；`isBefore`、`isAfter`、`isSame` 返回布尔值。输入必须能解析为单个具体公历日期，如「2018年初」「2018年第二季度前」。数量、范围、季度区间、无效文本及非字符串输入均抛出 `TypeError`。

比较使用公历年月日数值，不依赖系统时区或原生 `Date` 的字符串解析。

## TypeScript

```ts
import { parse, parseAll } from '@crapthings/chinese-timeword-parser'
import type { ParseResult, TimewordMatch } from '@crapthings/chinese-timeword-parser'

const result: ParseResult | undefined = parse('十日内')
if (result) console.log(result.token, result.value)
const matches: TimewordMatch[] = parseAll('十日内，两周后')
```

## 与 chinese-datetime-parser 的分工

[chinese-datetime-parser](https://github.com/crapthings/chinese-datetime-parser) 提取完整公历日期及附着的钟点。本库提取期限、方向和季度语义；不提供日期与相对期限组合计算。

## 迁移和开发

移除 Moment 和 AVA，使用 Node.js 内置测试运行器。有效旧样例保留返回格式；未匹配由意外异常改为 `undefined`，比较无法确定为单个日期时统一抛出 `TypeError`。旧版未声明 Node 最低版本，新版要求 Node.js >=18。

```sh
npm test
```

测试保留全部旧样例，并覆盖 400 年公历周期的季度边界、数字、无效候选、原文偏移、比较和长文本。
