import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view"
import { RangeSetBuilder, EditorSelection } from "@codemirror/state"
import { processObTemplate } from "src/utils/templates"

/**
 * 用于展示日期变量预览的小部件
 */
class DatePreviewWidget extends WidgetType {
    constructor(readonly template: string, readonly formatted: string) {
        super()
    }

    eq(other: DatePreviewWidget) {
        return this.template === other.template && this.formatted === other.formatted
    }

    toDOM() {
        const span = document.createElement("span")
        span.className = "form--DateTemplatePreview"
        span.textContent = this.formatted
        span.title = `Template: ${this.template}`
        span.setAttribute("data-template", this.template)
        return span
    }
}

/**
 * 识别日期变量的正则表达式
 */
const dateTimePatterns = [
    /\{\{date:([^}]*)\}\}/g, // 使用转义的花括号和更明确的非花括号字符匹配
    /\{\{time:([^}]*)\}\}/g,
    /\{\{date\}\}/g,
    /\{\{time\}\}/g
]

/**
 * 判断光标是否在时间变量附近
 * @param selection 编辑器的选择范围
 * @param start 变量开始位置
 * @param end 变量结束位置
 * @returns 如果光标在变量附近返回true
 */
function isCursorOnVariable(selection: EditorSelection, start: number, end: number): boolean {
    for (const range of selection.ranges) {
        // 检查光标位置是否与变量范围重叠
        if ((range.from >= start && range.from <= end) ||  // 光标起点在变量范围内
            (range.to >= start && range.to <= end) ||      // 光标终点在变量范围内
            (range.from <= start && range.to >= end)) {    // 选择包含整个变量
            return true;
        }
    }

    return false;
}

/**
 * 日期模板预览插件
 */
const timeTemplatePreviewPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view)
    }

    /**
 * 构建所有的装饰
 */
    buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        const content = view.state.doc.toString();
        const selection = view.state.selection;

        // 首先收集所有匹配及其装饰，然后按位置排序
        const decorations: Array<{ from: number, to: number, decoration: Decoration }> = [];

        try {
            // 查找所有日期和时间模板
            for (const pattern of dateTimePatterns) {
                pattern.lastIndex = 0; // 重置正则表达式状态

                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const start = match.index;
                    const end = start + match[0].length;
                    const template = match[0];
                    const cursorOnVariable = isCursorOnVariable(selection, start, end);

                    if (!cursorOnVariable) {
                        const formatted = processObTemplate(template);
                        if (formatted && formatted !== template) {
                            decorations.push({
                                from: start,
                                to: end,
                                decoration: Decoration.replace({
                                    widget: new DatePreviewWidget(template, formatted)
                                })
                            });
                        }
                    }
                }
            }

            decorations.sort((a, b) => a.from - b.from);
            for (const { from, to, decoration } of decorations) {
                builder.add(from, to, decoration);
            }
        } catch (e) {
            console.error('Error processing date templates:', e);
        }

        return builder.finish();
    }


    /**
     * 更新装饰
     */
    update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view)
        }
    }
}, {
    decorations: instance => instance.decorations
})

/**
 * 日期模板预览样式 - 增强可见性
 */
const timeTemplateStyle = EditorView.baseTheme({
    ".form--DateTemplatePreview": {
        backgroundColor: "hsl(var(--interactive-accent-hsl), 0.1)",
        color: "hsl(var(--interactive-accent-hsl), 1)",
        fontSize: "var(--font-ui-smaller)",
        border: "1px dashed hsl(var(--interactive-accent-hsl), 0.5)",
        borderRadius: "var(--radius-m)",
        fontStyle: "italic",
        display: "inline-block",
        padding: "0 4px",
    }
})

/**
 * 导出日期模板预览扩展
 */
export const timeTemplatePreviewExtension = [timeTemplatePreviewPlugin, timeTemplateStyle]