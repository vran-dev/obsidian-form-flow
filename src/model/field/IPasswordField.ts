import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface IPasswordField extends IFormField {
    type: FormFieldType.PASSWORD;
}