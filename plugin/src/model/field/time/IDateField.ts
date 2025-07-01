import { FormFieldType } from "../../enums/FormFieldType";
import { BaseTimeField } from "./BaseTimeField";

export interface IDateField extends BaseTimeField {
    type: FormFieldType.DATE;
}