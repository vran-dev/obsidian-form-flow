import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface ITextField extends IFormField {
    type: FormFieldType.TEXT;
}