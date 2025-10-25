import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";

export class RunCommandFormAction extends BaseFormAction {
    type: FormActionType.RUN_COMMAND;
    commandId?: string;
    commandName?: string;

    constructor(partial?: Partial<RunCommandFormAction>) {
        super(partial);
        this.type = FormActionType.RUN_COMMAND;
        Object.assign(this, partial);
    }
}

