import { App, MarkdownView } from "obsidian";

export type WriteOptions = {
    mode?: 'insert' | 'replace' | 'append';  // 默认为 'insert'
    position?: 'cursor' | 'end' | number;    // 默认为 'cursor'
    newline?: boolean;                      // 是否在插入前添加换行，默认为 false
}

export function write(app: App, text: string, options?: WriteOptions) {
    const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) {
        throw new Error("No active editor found");
    }

    const mode = options?.mode || 'insert';
    const position = options?.position || 'cursor';
    const newline = options?.newline || false;

    let content = text;
    if (newline && content && !content.startsWith('\n')) {
        content = '\n' + content;
    }
    const from = editor.getCursor("from");

    if (mode === 'replace') {
        // 替换选中文本
        const to = editor.getCursor("to");
        const origin = editor.getSelection();
        editor.replaceRange(content, from, to, origin);
    } else if (mode === 'append') {
        const lastLine = editor.lastLine();
        const lastLineText = editor.getLine(lastLine);
        let appendText = content;
        if (newline) {
            appendText = '\n' + appendText;
        }
        editor.replaceRange(appendText, { line: lastLine, ch: lastLineText.length });
    } else {
        // 默认：插入到当前光标位置
        if (typeof position === 'number') {
            // 插入到指定行
            const line = Math.min(Math.max(position, 0), editor.lastLine());
            const lineText = editor.getLine(line);
            editor.replaceRange(content, { line, ch: lineText.length });
        } else if (position === 'end') {
            // 插入到文件末尾
            const lastLine = editor.lastLine();
            const lastLineText = editor.getLine(lastLine);
            const needNewline = lastLineText && lastLineText.trim().length > 0;
            const appendText = needNewline ? '\n' + content : content;
            editor.replaceRange(appendText, { line: lastLine, ch: lastLineText.length });
        } else {
            editor.replaceRange(content, from);
        }
    }
    const newCursor = {
        line: from.line,
        ch: from.ch + content.length
    };
    editor.setCursor(newCursor);
    return true;
}