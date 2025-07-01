import { FormFieldType } from "../../enums/FormFieldType";
import { BaseTimeField } from "./BaseTimeField";

export interface IDateTimeField extends BaseTimeField {
    type: FormFieldType.DATETIME;
}