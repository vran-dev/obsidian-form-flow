import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface ICheckboxField extends IFormField {
    type: FormFieldType.CHECKBOX;
}