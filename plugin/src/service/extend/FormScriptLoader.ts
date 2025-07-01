import { App, normalizePath, TFile } from "obsidian";
import { FormScriptComipler } from "./FormScriptComipler";
import { FormScript } from "./FormScript";

export class FormScriptLoader {

    async loadAll(app: App, folder: string) {
        // folder
        const extendFiles = this.loadExtensionFiles(folder);
        const extension: FormScript[] = [];
        for (const extendFile of extendFiles) {
            const extend = await this.load(app, extendFile);
            if (extend) {
                extension.push(extend);
            }
        }
        return extension;
    }

    private loadExtensionFiles(folder: string) {
        const normalizedFolder = normalizePath(folder)
        return app.vault.getFiles().filter(f => {
            return f.path.startsWith(normalizedFolder) && f.extension === "js";
        })
    }

    async load(app: App, extendFile: TFile): Promise<FormScript | null> {
        const content = await app.vault.read(extendFile);
        const extension = await this.compile(content, extendFile.path);
        return extension;
    }

    private async compile(content: string, filePath: string) {
        return FormScriptComipler.compile(filePath, content);
    }

}