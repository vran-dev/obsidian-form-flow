import { FormFieldType } from "../enums/FormFieldType";
import { IOptionsField } from "./ISelectField";

export interface IRadioField extends IOptionsField {
    type: FormFieldType.RADIO;
}