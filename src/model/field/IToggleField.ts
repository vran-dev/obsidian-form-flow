import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface IToggleField extends IFormField {
    type: FormFieldType.TOGGLE;
}