
import { App, normalizePath, TFile } from 'obsidian';
export class Files {

    static async createFile(app: App, fileName: string, folder: string, data: string): Promise<TFile> {
        if (fileName === null || fileName === undefined || fileName.trim() === "") {
            throw new Error("File name cannot be empty");
        }

        if (folder === null || folder === undefined || folder.trim() === "") {
            throw new Error("Folder cannot be empty");
        }

        const filePath = normalizePath(`${folder}/${fileName}`);
        const file = app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            return file;
        }

        const normlizedFolder = normalizePath(folder);
        const folderExists = await app.vault.exists(normlizedFolder);
        if (!folderExists) {
            await app.vault.createFolder(normlizedFolder);
        }

        await app.vault.adapter.write(
            normalizePath(filePath),
            data
        );
        const res = app.vault.getAbstractFileByPath(filePath)
        if (res instanceof TFile) {
            return res;
        } else {
            throw new Error(`Failed to create file: ${filePath}`);
        }
    }
}