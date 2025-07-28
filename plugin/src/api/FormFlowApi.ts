import { App, Notice, TFile } from "obsidian";
import { FormService } from "src/service/FormService";
import { FormConfig } from "src/model/FormConfig";

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
	
    async submitFormFile(filePath: string): Promise<void> {
        const formService = new FormService();
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            const form = await this.app.vault.readJson(file.path) as FormConfig;
            await formService.submitDirectly(form, this.app);
        } else {
            new Notice(`Form File not found: ${filePath}`);
        }
    }

}
