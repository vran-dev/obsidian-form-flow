import { TFile } from "obsidian";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { ActionContext } from "../IActionService";
import { localInstance } from "src/i18n/locals";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { UpdateFrontmatterFormAction } from "src/model/action/UpdateFrontmatterFormAction";
import { createFileByText } from "src/utils/createFileByText";
import { Strings } from "src/utils/Strings";

export async function createFileFromActionIfNotExists(
    filePath: string,
    action: UpdateFrontmatterFormAction | InsertTextFormAction,
    context: ActionContext): Promise<TFile> {
    const app = context.app;
    const file = app.vault.getAbstractFileByPath(filePath);
    if (file instanceof TFile) {
        return file;
    }

    const templateFilePath = action.newFileTemplate;
    let content = "";
    if (Strings.isNotBlank(templateFilePath)) {
        const engine = new FormTemplateProcessEngine();
        const templatePath = await engine.process(templateFilePath!, context.state, app);
        const templateFile = app.vault.getAbstractFileByPath(templatePath);
        if (!templateFile || !(templateFile instanceof TFile)) {
            throw new Error(localInstance.template_file_not_exists + ": " + templateFilePath);
        }
        const templateContent = await app.vault.cachedRead(templateFile);
        content = await engine.process(templateContent, context.state, context.app);
    }
    return await createFileByText(app, filePath, content);
}