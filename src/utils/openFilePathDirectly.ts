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
    const tFile = app.vault.getAbstractFileByPath(filePath) as TFile;
    if (tFile) {
        openFile(app, null, tFile, {
            openType: openType,
        });
    }
}