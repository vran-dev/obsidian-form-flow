import { autocompletion, Completion, CompletionContext, CompletionResult, startCompletion } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";

// 定义变量补全项的类型
type VariableCompletionItem = {
    label: string;
    detail?: string;
    info?: string;
    type?: string;
}

/**
 * 表单变量自动补全源
 */
export function formVariableCompletions(variables: VariableCompletionItem[]) {
    const mapping: Completion[] = variables.map(variable => ({
        label: variable.label,
        detail: variable.detail,
        info: variable.info,
        type: variable.type,
        apply: (view, completion, from, to) => {
            // 获取行文本，检查前后文
            const pos = view.state.selection.main.head;
            const line = view.state.doc.lineAt(pos);
            const lineText = line.text;

            // 检查是否在 {{@ 模式中
            const beforeMatch = lineText.substring(0, to - line.from).match(/\{\{@$/);

            let text;
            if (beforeMatch) {
                text = `${variable.label}}}`;
            } else {
                // 如果没有 {{@ 符号，直接插入变量名
                text = `{{@${variable.label}}}`;
            }
            view.dispatch({
                changes: { from, to, insert: text },
                selection: { anchor: from + text.length },
                userEvent: "input.complete"
            });
        },
        boost: 99
    }));

    return (context: CompletionContext): CompletionResult | null => {
        // 获取当前光标位置之前的文本
        const { state, pos } = context;
        const line = state.doc.lineAt(pos);
        const textBefore = line.text.slice(0, pos - line.from);

        // 检查是否刚输入了 @ 符号
        if (/(?:^|\s)@$/.test(textBefore)) {
            return {
                from: pos - 1, // 从 @ 符号开始
                options: mapping,
                filter: false, // 禁用默认过滤，我们将实现自己的过滤
            };
        }

        // 检查是否在 {{@ 之后
        if (/\{\{@$/.test(textBefore)) {
            return {
                from: pos,
                options: mapping,
                filter: false,
            };
        }

        // 检查是否在已经打开的 {{@ 内，例如 {{@us 应该匹配像 user 这样的变量
        const match = textBefore.match(/\{\{@([^}]*)$/);
        if (match) {
            const prefix = match[1];
            // 只显示与前缀匹配的选项
            const filteredOptions = mapping.filter(option =>
                option.label.toLowerCase().includes(prefix.toLowerCase())
            );

            if (filteredOptions.length) {
                return {
                    from: pos - prefix.length,
                    options: filteredOptions,
                    filter: false,
                };
            }
        }

        return null;
    };
}

/**
 * 创建表单变量自动补全扩展
 * @param variables 要补全的变量列表
 */
export function createFormVariableSuggestions(variables: VariableCompletionItem[]) {
    return autocompletion({
        override: [formVariableCompletions(variables)],
        activateOnTyping: true,
        selectOnOpen: true,
        icons: true,
        defaultKeymap: true,
        optionClass: option => option.type === "variable" ? "cm-completion-variable" : "",
        addToOptions: [
            {
                render(completion, state) {
                    return null;
                },
                position: 20
            }
        ]
    });
}

/**
 * 触发自动补全的扩展函数
 * 这可以被添加到编辑器的命令中以手动触发自动补全
 */
export function triggerVariableSuggest(view: EditorView) {
    startCompletion(view);
    return true;
}

// 为自动补全添加样式
const variableSuggestionStyle = EditorView.baseTheme({
    ".cm-completionIcon.cm-variable-icon": {
        color: "var(--interactive-accent)",
        fontWeight: "bold",
        display: "none",
    },
    ".cm-completionIcon": {
        marginRight: "8px",
        textAlign: "center",
        width: "1.2em",
        display: "none",
    },
    ".cm-completion-variable": {
        backgroundColor: "var(--interactive-accent-hover)",
        borderRadius: "4px"
    },
    "&light .cm-completion-variable": {
        color: "var(--text-on-accent)"
    },
    "&dark .cm-completion-variable": {
        color: "var(--text-on-accent)"
    }
});

// 导出完整扩展，包含样式
export const variableSuggestExtension = [
    variableSuggestionStyle
];