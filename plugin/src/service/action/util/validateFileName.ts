import { localInstance } from "src/i18n/locals";
import { FileBaseFormAction } from "src/model/action/FileBaseFormAction";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { UpdateFrontmatterFormAction } from "src/model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { getFilePathCompatible } from "src/utils/getFilePathCompatible";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { ActionContext } from "../IActionService";

export async function validateFileName(action: FileBaseFormAction, context: ActionContext) {

    const failIfIsBlank = (str: string, errMessage: string) => {
        if (!str || str.trim() === "") {
            throw new Error(errMessage);
        }
    }

    const path = getFilePathCompatible(action);
    const state = context.state;
    const engine = new FormTemplateProcessEngine();
    const filePath = await engine.process(path, state, context.app);

    if (action.type === FormActionType.CREATE_FILE) {
        failIfIsBlank(filePath, localInstance.file_name_cannot_be_empty);
    } else if (action.type === FormActionType.INSERT_TEXT || action.type === FormActionType.UPDATE_FRONTMATTER) {
        const ac = action as (InsertTextFormAction | UpdateFrontmatterFormAction);
        if (ac.targetFileType === TargetFileType.SPECIFIED_FILE) {
            failIfIsBlank(filePath, localInstance.file_name_cannot_be_empty);
        }
    }
}