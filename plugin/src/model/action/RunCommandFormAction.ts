import { FormActionType } from "../enums/FormActionType";
import { IFormAction } from "./IFormAction";

export interface RunCommandFormAction extends IFormAction {
    type: FormActionType.RUN_COMMAND;
    commandId?: string;
    commandName?: string;
}

