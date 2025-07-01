import { IFormField } from "../model/field/IFormField";
import { FormIdValues } from "../service/FormValues";
import { getFieldDefaultValue } from "./getFieldDefaultValue";

export function resolveDefaultFormIdValues(fields: IFormField[]): FormIdValues {
    return fields.reduce((prev, curr) => {
        prev[curr.id] = getFieldDefaultValue(curr);
        return prev;
    }, {} as Record<string, any>);
}