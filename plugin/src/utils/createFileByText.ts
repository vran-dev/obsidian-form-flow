import { App, TFile, normalizePath, Notice } from "obsidian";
import { localInstance } from "src/i18n/locals";
import { FileConflictResolution } from "src/model/enums/FileConflictResolution";
import { processObTemplate } from "./templates";
import { generateUniqueFilePath } from "./generateUniqueFilePath";

export async function createFileByText(
    app: App,
    newFilePath: string,
    template: string,
    conflictResolution: FileConflictResolution = FileConflictResolution.SKIP
): Promise<TFile> {
    const parent = newFilePath.substring(0, newFilePath.lastIndexOf("/"));
    const isExists = await app.vault.exists(parent);
    if (!isExists) {
        await app.vault.createFolder(parent);
    }

    const normalizedNewFilePath = normalizePath(newFilePath);
    const existingFile = app.vault.getAbstractFileByPath(normalizedNewFilePath);
    
    if (existingFile != null) {
        switch (conflictResolution) {
            case FileConflictResolution.SKIP:
                // new Notice(localInstance.file_already_exists.format(newFilePath));
                return Promise.resolve(existingFile as TFile);
                
            case FileConflictResolution.AUTO_RENAME:
                const uniquePath = generateUniqueFilePath(app, normalizedNewFilePath);
                const processedTemplate = processObTemplate(template);
                return await app.vault.create(uniquePath, processedTemplate);
                
            case FileConflictResolution.OVERWRITE:
                if (existingFile instanceof TFile) {
                    const processedTemplate = processObTemplate(template);
                    await app.vault.modify(existingFile, processedTemplate);
                    return existingFile;
                } else {
                    throw new Error(`Cannot overwrite non-file: ${newFilePath}`);
                }
                
            default:
                throw new Error(`Unknown conflict resolution strategy: ${conflictResolution}`);
        }
    }
    
    const processedTemplate = processObTemplate(template);
    return await app.vault.create(normalizedNewFilePath, processedTemplate);
}