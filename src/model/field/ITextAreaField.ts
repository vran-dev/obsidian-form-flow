import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface ITextAreaField extends IFormField {
    type: FormFieldType.TEXTAREA;
    rows?: number;
}