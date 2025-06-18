import { IFormField } from "../IFormField";

export interface BaseTimeField extends IFormField {
    defaultValueType: TimeFieldDefaultValueType;
}

export enum TimeFieldDefaultValueType {
    CURRENT = "current",
    CUSTOM = "custom",
}