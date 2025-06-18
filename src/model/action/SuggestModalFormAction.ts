import { FormActionType } from "../enums/FormActionType";
import { IFormAction } from "./IFormAction";

export type SuggestItem = {
    id: string;
    label: string;
    value?: string;
}

export interface SuggestModalFormAction extends IFormAction {
    type: FormActionType.SUGGEST_MODAL;
    fieldName: string;
    suggestSource: SuggestSource;
    items: SuggestItem[];
    code?: string;
}

export enum SuggestSource {
    LIST = "list",
    SCRIPT = "script",
}