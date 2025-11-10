import { FormActionType } from "../enums/FormActionType";
import { FileBaseFormAction } from "./FileBaseFormAction";
import { TargetFileType } from "../enums/TargetFileType";


export class MoveFileFormAction extends FileBaseFormAction {
    type: FormActionType.MOVE_FILE;
    targetFileType: TargetFileType;
    targetFolder: string;

    constructor(partial?: Partial<MoveFileFormAction>) {
        super(partial);
        this.type = FormActionType.MOVE_FILE;
        this.targetFileType = TargetFileType.SPECIFIED_FILE;
        this.targetFolder = "";
        Object.assign(this, partial);
    }
}