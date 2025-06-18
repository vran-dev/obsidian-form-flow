import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface IPropertyValueField extends IFormField {
    type: FormFieldType.PROPERTY_VALUE_SUGGESTION;
    propertyName: string;
    multiple: boolean;
}