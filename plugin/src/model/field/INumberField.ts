import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface INumberField extends IFormField {
    type: FormFieldType.NUMBER;
}