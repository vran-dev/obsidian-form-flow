import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface ISelectField extends IOptionsField {
    type: FormFieldType.SELECT;
    multiple?: boolean;
}

export interface IOptionsField extends IFormField {
    options: SelectOption[];
    enableCustomValue?: boolean;
}

export interface SelectOption {
    id: string;
    label: string;
    value: any;
}