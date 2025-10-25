import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";
import { IFormAction } from "./IFormAction";

export type SuggestItem = {
    id: string;
    label: string;
    value?: string;
}

export class SuggestModalFormAction extends BaseFormAction {
    type: FormActionType.SUGGEST_MODAL;
    fieldName: string;
    suggestSource: SuggestSource;
    items: SuggestItem[];
    code?: string;
    constructor(partial?: Partial<SuggestModalFormAction>) {
        super(partial);
        this.type = FormActionType.SUGGEST_MODAL;
        this.fieldName = "";
        this.suggestSource = SuggestSource.LIST;
        this.items = [];
        Object.assign(this, partial);
    }
}

export enum SuggestSource {
    LIST = "list",
    SCRIPT = "script",
}