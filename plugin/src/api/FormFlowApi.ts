import { App, Notice, TFile } from "obsidian";
import { FormService } from "src/service/FormService";

export class FormFlowApi {

    constructor(public app: App) {

    }

    async openFormFile(filePath: string): Promise<void> {
        const formService = new FormService();
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            await formService.open(file, this.app);
        } else {
            new Notice(`Form File not found: ${filePath}`);
        }
    }

}