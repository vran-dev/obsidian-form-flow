import { App, TFile, normalizePath, Notice } from "obsidian";
import { localInstance } from "src/i18n/locals";
import { processObTemplate } from "./templates";

export async function createFileByText(
    app: App,
    newFilePath: string,
    template: string
): Promise<TFile> {
    const parent = newFilePath.substring(0, newFilePath.lastIndexOf("/"));
    const isExists = await app.vault.adapter.exists(parent);
    if (!isExists) {
        await app.vault.adapter.mkdir(parent);
    }

    const normalizedNewFilePath = normalizePath(newFilePath);
    const file = app.vault.getAbstractFileByPath(normalizedNewFilePath);
    if (file != null) {
        new Notice(localInstance.file_already_exists.format(newFilePath));
        return Promise.resolve(file as TFile);
    }
    const processedTemplate = processObTemplate(template);
    return await app.vault.create(normalizedNewFilePath, processedTemplate);
}