import { IFormAction } from "src/model/action/IFormAction";
import { WaitFormAction, DEFAULT_WAIT_TIME, DEFAULT_WAIT_UNIT } from "src/model/action/WaitFormAction";
import { CreateFileFormAction } from "src/model/action/CreateFileFormAction";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { RunScriptFormAction, ScriptSourceType } from "src/model/action/RunScriptFormAction";
import { SuggestModalFormAction } from "src/model/action/SuggestModalFormAction";
import { UpdateFrontmatterFormAction } from "src/model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { FileConflictResolution } from "src/model/enums/FileConflictResolution";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { TextInsertPosition } from "src/model/enums/TextInsertPosition";
import { OpenPageInType } from "src/model/enums/OpenPageInType";
import { v4 } from "uuid";

export function createDefaultActionByType(type: FormActionType, baseAction?: Partial<IFormAction>): IFormAction {
    const baseId = baseAction?.id || v4();
    const baseCondition = baseAction?.condition;
    const baseRemark = baseAction?.remark;

    switch (type) {
        case FormActionType.WAIT:
            return {
                id: baseId,
                type: FormActionType.WAIT,
                waitTime: DEFAULT_WAIT_TIME,
                unit: DEFAULT_WAIT_UNIT,
                condition: baseCondition,
                remark: baseRemark,
            } as WaitFormAction;

        case FormActionType.CREATE_FILE:
            return {
                id: baseId,
                type: FormActionType.CREATE_FILE,
                targetFolder: "",
                fileName: "",
                filePath: "",
                conflictResolution: FileConflictResolution.SKIP,
                condition: baseCondition,
                remark: baseRemark,
            } as CreateFileFormAction;

        case FormActionType.INSERT_TEXT:
            return {
                id: baseId,
                type: FormActionType.INSERT_TEXT,
                targetFileType: TargetFileType.CURRENT_FILE,
                position: TextInsertPosition.END_OF_CONTENT,
                content: "",
                openPageIn: OpenPageInType.none,
                newFileTemplate: "",
                heading: "",
                filePath: "",
                targetFolder: "",
                fileName: "",
                condition: baseCondition,
                remark: baseRemark,
            } as InsertTextFormAction;

        case FormActionType.RUN_SCRIPT:
            return {
                id: baseId,
                type: FormActionType.RUN_SCRIPT,
                scriptSource: ScriptSourceType.EXTENSION,
                code: "",
                title: "",
                condition: baseCondition,
                remark: baseRemark,
            } as RunScriptFormAction;

        case FormActionType.SUGGEST_MODAL:
            return {
                id: baseId,
                type: FormActionType.SUGGEST_MODAL,
                fieldName: "",
                condition: baseCondition,
                remark: baseRemark,
            } as SuggestModalFormAction;

        case FormActionType.UPDATE_FRONTMATTER:
            return {
                id: baseId,
                type: FormActionType.UPDATE_FRONTMATTER,
                targetFileType: TargetFileType.CURRENT_FILE,
                propertyUpdates: [],
                newFileTemplate: "",
                filePath: "",
                targetFolder: "",
                fileName: "",
                condition: baseCondition,
                remark: baseRemark,
            } as UpdateFrontmatterFormAction;

        default:
            // Default to CREATE_FILE for backwards compatibility
            return {
                id: baseId,
                type: FormActionType.CREATE_FILE,
                targetFolder: "",
                fileName: "",
                filePath: "",
                conflictResolution: FileConflictResolution.SKIP,
                condition: baseCondition,
                remark: baseRemark,
            } as CreateFileFormAction;
    }
}