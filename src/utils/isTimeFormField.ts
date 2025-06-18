import { FormFieldType } from "../model/enums/FormFieldType";

export function isTimeFormField(type: FormFieldType) {
    const types = [
        FormFieldType.TIME,
        FormFieldType.DATE,
        FormFieldType.DATETIME,
    ];
    if (types.includes(type)) {
        return true;
    }
    return false;
}