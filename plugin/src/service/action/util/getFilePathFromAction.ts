import { normalizePath } from "obsidian";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { ActionContext } from "../IActionService";
import { localInstance } from "src/i18n/locals";
import { CreateFileFormAction } from "src/model/action/CreateFileFormAction";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { UpdateFrontmatterFormAction } from "src/model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { focusLatestEditor } from "src/utils/focusLatestEditor";
import { getFilePathCompatible } from "src/utils/getFilePathCompatible";

type Action = CreateFileFormAction | InsertTextFormAction | UpdateFrontmatterFormAction;

export async function getFilePathFromAction(formAction: Action, context: ActionContext) {
    const app = context.app;
    if (formAction.type === FormActionType.CREATE_FILE) {
        const filePath = await resolveFilePath(formAction as CreateFileFormAction, context);
        return filePath;
    } else {
        if (formAction.targetFileType === TargetFileType.CURRENT_FILE) {
            focusLatestEditor(app);
            const file = app.workspace.getActiveFile();
            if (!file || file.extension !== "md") {
                throw new Error(localInstance.please_open_and_focus_on_markdown_file);
            }
            return file.path;
        } else {
            const filePath = await resolveFilePath(formAction, context);
            return filePath;
        }
    }

}

async function resolveFilePath(formAction: CreateFileFormAction | InsertTextFormAction | UpdateFrontmatterFormAction, context: ActionContext) {
    const engine = new FormTemplateProcessEngine();
    const path = getFilePathCompatible(formAction);
    let filePath = await engine.process(path, context.state, context.app);
    filePath = normalizePath(filePath);
    return filePath;
}
