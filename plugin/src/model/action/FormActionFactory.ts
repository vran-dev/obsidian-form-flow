import { FormActionType } from "../enums/FormActionType";
import { CreateFileFormAction } from "./CreateFileFormAction";
import { IFormAction } from "./IFormAction";
import { InsertTextFormAction } from "./InsertTextFormAction";
import { RunCommandFormAction } from "./RunCommandFormAction";
import { RunScriptFormAction } from "./RunScriptFormAction";
import { SuggestModalFormAction } from "./SuggestModalFormAction";
import { UpdateFrontmatterFormAction } from "./UpdateFrontmatterFormAction";
import { WaitFormAction } from "./WaitFormAction";

export class FormActionFactory {
    static create(type: FormActionType, partial?: Partial<IFormAction>): IFormAction {
        switch (type) {
            case FormActionType.RUN_COMMAND:
                return new RunCommandFormAction({
                    ...partial,
                    type: FormActionType.RUN_COMMAND
                });
            case FormActionType.SUGGEST_MODAL:
                return new SuggestModalFormAction({
                    ...partial,
                    type: FormActionType.SUGGEST_MODAL
                });
            case FormActionType.CREATE_FILE:
                return new CreateFileFormAction({
                    ...partial,
                    type: FormActionType.CREATE_FILE
                });
            case FormActionType.INSERT_TEXT:
                return new InsertTextFormAction({
                    ...partial,
                    type: FormActionType.INSERT_TEXT
                });
            case FormActionType.UPDATE_FRONTMATTER:
                return new UpdateFrontmatterFormAction({
                    ...partial,
                    type: FormActionType.UPDATE_FRONTMATTER
                });
            case FormActionType.RUN_SCRIPT:
                return new RunScriptFormAction({
                    ...partial,
                    type: FormActionType.RUN_SCRIPT
                });
            case FormActionType.WAIT:
                return new WaitFormAction({
                    ...partial,
                    type: FormActionType.WAIT
                });
            default:
                throw new Error(`Unsupported FormActionType: ${type}`);
        }
    }
}