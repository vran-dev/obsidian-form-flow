import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";

export class WriteToClipboardFormAction extends BaseFormAction {
    type: FormActionType.WRITE_TO_CLIPBOARD;

    /**
     * Content to write to clipboard
     * Supports variables like {{@fieldName}}, {{selection}}, {{clipboard}}, etc.
     */
    content: string;

    constructor(partial?: Partial<WriteToClipboardFormAction>) {
        super(partial);
        this.type = FormActionType.WRITE_TO_CLIPBOARD;
        this.content = "";
        Object.assign(this, partial);
    }
}