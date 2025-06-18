import { App, MarkdownView } from "obsidian";

export function getEditorSelection(app: App) {
    const editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    if (!editor) {
        return "";
    }

    // @ts-ignore
    if (editor.getTableSelection) {
        // @ts-ignore
        const tableSelections = editor.getTableSelection() as TableSelection[];
        if (tableSelections.length > 0) {
            const rows: string[] = []
            for (const tableSelection of tableSelections) {
                const row = tableSelection.row;
                const text = tableSelection.text || ""
                if (rows[row]) {
                    rows[row] = rows[row] + "|" + text
                } else {
                    rows[row] = text
                }
            }
            const result = rows.filter(row => row !== undefined).map((row, index) => {
                return "|" + row + "|"
            }).join("\n")
            return result;
        }
    }
    const selection = editor.getSelection();
    if (selection) {
        return selection;
    }
    return "";
}

type TableSelection = {
    row: number; // start with 0
    col: number; // start with 0
    text: string;
}