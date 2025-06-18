import { FormActionType } from "../enums/FormActionType";
import { TextInsertPosition } from "../enums/TextInsertPosition";
import { TargetFileType } from "../enums/TargetFileType";
import { FileBaseFormAction } from "./FileBaseFormAction";
import { OpenPageInType } from "../enums/OpenPageInType";

export interface InsertTextFormAction extends FileBaseFormAction {

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

}

