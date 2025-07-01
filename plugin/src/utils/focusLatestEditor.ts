import { App, MarkdownView, WorkspaceLeaf } from "obsidian";

export function focusLatestEditor(app: App) {
    let markdownview = app.workspace.getActiveViewOfType(MarkdownView);
    if (!markdownview) {
        let current = null as WorkspaceLeaf | null;
        app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view instanceof MarkdownView) {
                if (!current) {
                    current = leaf;
                } else if (current.activeTime! <= leaf.activeTime!) {
                    current = leaf;
                }
            }
        })
        if (current !== null) {
            markdownview = current.view as MarkdownView;
        }
    }

    if (markdownview) {
        markdownview.editor.focus();
    }
}