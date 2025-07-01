import { App, TFile } from "obsidian";
import { openFile } from "./openFile";

export function openFilePathDirectly(
    app: App,
    filePath: string,
    openType?:
        | boolean
        | "tab"
        | "split"
        | "modal"
        | "window"
        | "current"
        | "none"
) {
    const f = app.vault.getAbstractFileByPath(filePath);
    if (f instanceof TFile) {
        openFile(app, null, f, {
            openType: openType,
        });
    }
}