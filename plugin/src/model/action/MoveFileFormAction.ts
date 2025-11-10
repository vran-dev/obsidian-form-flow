import { FormActionType } from "../enums/FormActionType";
import { TargetFileType } from "../enums/TargetFileType";
import { FileBaseFormAction } from "./FileBaseFormAction";

export class MoveFileFormAction extends FileBaseFormAction {
    type: FormActionType.MOVE_FILE;
    
    targetFileType: TargetFileType;
    
    moveTargetFolder: string;

    constructor(partial?: Partial<MoveFileFormAction>) {
        super(partial);
        this.type = FormActionType.MOVE_FILE;
        this.targetFileType = TargetFileType.CURRENT_FILE;
        this.moveTargetFolder = "";
        Object.assign(this, partial);
    }
}
