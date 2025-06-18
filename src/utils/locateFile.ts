import { App, TFile, TFolder } from "obsidian";

export default function (folder: string, app: App) {
    const f = app.vault.getAbstractFileByPath(folder);
    if (f instanceof TFolder || f instanceof TFile) {
        const fileExplorer =
            // @ts-ignore
            app.internalPlugins.plugins["file-explorer"].instance;
        fileExplorer.revealInFolder(f);
    }
};