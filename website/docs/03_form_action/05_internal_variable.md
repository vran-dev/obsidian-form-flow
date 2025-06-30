---
sidebar_position: 5
sidebar_label: 内置变量
---

除了表单变量外，Form Flow 还内置了一些实用的变量

## `{{date}}`

日期变量，在输出时会自动转换成当前时间，比如 `2025-01-01T00:00`。

可以通过 [momen Format](https://momentjs.com/docs/#/parsing/string-format/) 语法来指定输出的日期格式，比如

- `{{date: YYYY-MM-DD}}` 输出 `2025-01-01`。
- `{{date: YYYY/MM/DD}}` 输出 `2025/01/01`

## `{{time}}`

时间变量，在输出时会自动转换成当前时间，比如 `12:00`。

也支持自定义输出格式，比如 

- `{{time: HH:mm:ss}}` 的输出就是 `12:00:00`
- `{{time: HH/mm}}` 的输出就是 `12/11`


## `{{clipboard}}`

剪贴板内容变量，在输出时会背替换成当前剪贴板中的内容。

需要注意的是在「运行脚本」的动作中使用的时候，需要在前面加上 `await` 关键词。

```js
const content = await clipboard
```


## `{{selection}}`
注意： 阅读模式 `{{selectino}}` 不可用

当前编辑器中选中的文本内容
