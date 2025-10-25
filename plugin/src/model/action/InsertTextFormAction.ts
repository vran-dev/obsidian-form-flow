import { FormActionType } from "../enums/FormActionType";
import { TextInsertPosition } from "../enums/TextInsertPosition";
import { TargetFileType } from "../enums/TargetFileType";
import { FileBaseFormAction } from "./FileBaseFormAction";
import { OpenPageInType } from "../enums/OpenPageInType";

export class InsertTextFormAction extends FileBaseFormAction {

    type: FormActionType.INSERT_TEXT

    openPageIn: OpenPageInType;

    newFileTemplate: string;

    targetFileType: TargetFileType;

    /*
    * position settings
    */
    position: TextInsertPosition;

    heading: string;

    content: string;

    constructor(partial?: Partial<InsertTextFormAction>) {
        super(partial);
        this.type = FormActionType.INSERT_TEXT;
        this.openPageIn = OpenPageInType.current;
        this.newFileTemplate = "";
        this.targetFileType = TargetFileType.SPECIFIED_FILE;
        this.position = TextInsertPosition.END_OF_CONTENT;
        this.heading = "";
        this.content = "";
        Object.assign(this, partial);
    }
}

