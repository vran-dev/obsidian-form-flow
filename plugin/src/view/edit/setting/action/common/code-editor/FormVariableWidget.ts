import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view"
import { RangeSetBuilder } from "@codemirror/state"

/**
 * 表单变量插件，为变量添加特殊样式而不替换它们
 */
const cformVariable = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    buildDecorations(view: EditorView) {
        const builder = new RangeSetBuilder<Decoration>();

        // 使用正则表达式查找所有变量
        const content = view.state.doc.toString();
        const pattern = /\{\{@([^}]+)\}\}/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            const prefixLength = 2; // '{{' 的长度
            const suffixLength = 2; // '}}' 的长度
            const variableStart = start + prefixLength;
            const variableEnd = end - suffixLength;

            // 为整个变量添加背景色和边框
            builder.add(start, end, Decoration.mark({
                class: "form--CpsFormVariableBlock",
            }));

            // 为前缀添加样式
            builder.add(start, variableStart, Decoration.mark({
                class: "form--CpsFormVariableBlockPrefix"
            }));

            // 为变量名添加特殊样式
            builder.add(variableStart, variableEnd, Decoration.mark({
                class: "form--CpsFormVariableBlockName"
            }));

            // 为后缀添加样式
            builder.add(variableEnd, end, Decoration.mark({
                class: "form--CpsFormVariableBlockSuffix"
            }));
        }

        return builder.finish();
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
        }
    }
}, {
    decorations: instance => instance.decorations
});


const formVariableStyle = EditorView.baseTheme({
    ".form--CpsFormVariableBlock": {
        backgroundColor: "hsl(var(--interactive-accent-hsl), 0.1)",
        color: "hsl(var(--interactive-accent-hsl), 1)",
        fontSize: "var(--font-ui-smaller)",
        border: "1px dashed hsl(var(--interactive-accent-hsl), 0.5)",
        borderRadius: "var(--radius-m)",
        fontStyle: "italic",
        display: "inline-block",
        padding: "0 4px",
    },
    ".form--CpsFormVariableBlockPrefix, .form--CpsFormVariableBlockSuffix": {
    },
    ".form--CpsFormVariableBlockName": {
    },
});

export const formVariableExtension = [cformVariable, formVariableStyle];
