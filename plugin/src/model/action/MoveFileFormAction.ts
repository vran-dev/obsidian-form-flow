import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";

export class MoveFileFormAction extends BaseFormAction {
    type: FormActionType.MOVE_FILE;
    isCurrentFile: boolean = true;
    file: string;
    targetFolder: string;

    constructor(partial?: Partial<MoveFileFormAction>) {
        super(partial);
        this.type = FormActionType.MOVE_FILE;
        this.isCurrentFile = true;
        this.file = "";
        this.targetFolder = "";
        Object.assign(this, partial);
    }
}