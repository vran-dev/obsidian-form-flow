---
sidebar_position: 4
sidebar_label: 运行脚本
---

脚本模式是面向高级用户的功能，允许用户在表单提交时执行自定义脚本。

脚本使用 JavaScript 编写，可以访问表单字段的值以及 Obsidian 的 API。

## 脚本来源

脚本有两种加载来源，分别是

-   扩展： 从指定的目录加载符合规范的 JS 脚本文件
-   代码： 直接在表单中编写脚本代码

## 脚本规范

1. 脚本必须导出一个 `entry` 函数作为入口点，插件会在表单提交时调用该函数。
2. 如果加载来源是 `扩展`, 脚本的 exports 还需要配置 `name` 字段，用户可以使用 `{name}()` 来执行脚本。

```javascript
async function entry() {
	const { app, form, requestUrl, obsidian, Notice, $selection } =
		this.$context;
	// write code here...
}

exports.default = {
	entry: entry,
	name: "My Script",
	description: "This is a sample script", // 可选，脚本的描述信息，仅适用于扩展加载来源
	tags: ["example", "script"], // 可选，脚本的标签，用于分类，仅适用于扩展加载来源
};
```

## 脚本上下文对象 $context

在脚本的入口函数 `entry` 中，我们可以通过 `this.$context` 来获取脚本的上下文对象，这个对象包含了以下属性：

-   `app`: Obsidian 的应用实例，可以访问 Obsidian 的 API。
-   `form`: 当前表单的实例，可以访问和修改表单字段的值。
-   `requestUrl`: 用于发送 HTTP 请求的工具，支持 GET、POST 等方法。
-   `obsidian`: Obsidian 的核心 API 对象，可以访问文件系统、设置等，详情查看 [Obsidian API](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts).
-   `Notice`: 用于显示通知的工具，可以用来提示用户。
-   `$selection`: 当前选中的文本内容，适用于在编辑器中执行脚本时获取选中的文本。
-   `$clipboard`: 用于访问剪贴板的工具，可以读取和写入剪贴板内容。
-   `moment`: 用于处理日期和时间的库，可以方便地进行日期格式化、计算等操作。

> 更多属性可以通过 console.log(this.$context) 查看

## 脚本示例

### 示例 1： 每日一言

从 `https://v1.hitokoto.cn/` 获取一言，并将其插入设置到表单字段中，后续执行动作可以通过 `{{@一言}}` 来引用这个值。

```javascript
async function entry() {
	const { app, form, requestUrl, obsidian, Notice, $selection } =
		this.$context;
	try {
		const response = await requestUrl({
			url: "https://v1.hitokoto.cn/",
			method: "GET",
		});
		if (response.status === 200) {
			const data = await response.json;
			form["一言"] =
				data.hitokoto +
				" —— " +
				data.from +
				"（" +
				data.from_who +
				"）";
			new Notice("一言获取成功: " + data.hitokoto);
		} else {
			new Notice("获取一言失败: " + response.statusText);
		}
	} catch (error) {
		new Notice("请求失败: " + error.message);
	}
}

/**
 * Must reserve export.default and set a entry function
 */
exports.default = {
	entry: entry,
};
```

返回的 json 结构参考

```json
{
	"id": 7173,
	"uuid": "49eff9ca-7145-4c5f-8e62-d3dca63537fa",
	"hitokoto": "即使人生是一场悲剧，也应该笑着把人生演完。",
	"type": "k",
	"from": "查拉图斯特如是说",
	"from_who": "尼采",
	"creator": "Kyanite",
	"creator_uid": 8042,
	"reviewer": 1,
	"commit_from": "web",
	"created_at": "1614946509",
	"length": 21
}
```

### 示例 2： 汇总今日总支出

当前脚本可以将指定标题下的所有支出记录汇总到表单字段中，后续执行动作可以通过 `{{@总支出}}` 来引用这个值。

示例数据

```markdown
## 日志

## 支出记录

-   09:00 早餐 11.11
-   10:00 咖啡 22.22
-   12:00 午餐 33.3
-   18:00 晚餐 55.12
```

汇总规则： 将指定的标题下 （form['支出记录保存位置']）的所有支出记录汇总，取每一行的最后的数字作为支出金额，最后将所有金额相加得到总支出。

```javascript
async function entry() {
	const { app, form, obsidian, Notice } = this.$context;
	const targetTitle = form["支出记录保存位置"];
	const totalField = "总支出";
	let total = 0;

	// 获取当前文件内容
	const file = app.workspace.getActiveFile();
	if (!file) {
		new Notice("没有激活的文件");
		return;
	}

	const content = await app.vault.read(file);
	const lines = content.split("\n");

	// 查找目标标题下的支出记录
	let isTargetSection = false;
	for (const line of lines) {
		if (line === targetTitle) {
			isTargetSection = true;
			continue;
		}

		if (line.startsWith("#") && line !== targetTitle) {
			isTargetSection = false;
		}

		if (isTargetSection && line.trim()) {
			const parts = line.split(" ");
			const amountStr = parts[parts.length - 1];
			const amount = parseFloat(amountStr);
			if (!isNaN(amount)) {
				total += amount;
			}
		}
	}

	form[totalField] = total.toFixed(2); // 保留两位小数
	new Notice(`今日总支出: ${form[totalField]} 元`);
}

exports.default = {
	entry: entry,
};
```
