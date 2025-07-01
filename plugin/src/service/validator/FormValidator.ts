import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { IOptionsField } from "src/model/field/ISelectField";
import { FormConfig } from "src/model/FormConfig";
import { FormVisibilies } from "../condition/FormVisibilies";
import { FormIdValues } from "../FormValues";
import { localInstance } from "src/i18n/locals";
import { Strings } from "src/utils/Strings";

export interface FieldValidationResult {
    valid: boolean;
    message: string;
}

export class FormValidator {

    public static validate(form: FormConfig, values: FormIdValues) {
        this.validateRequireds(form.fields, values);
    }

    public static validateRequireds(fields: IFormField[], values: FormIdValues) {
        const formValues = values || {};
        const visibleFields = FormVisibilies.visibleFields(fields, values);
        visibleFields.forEach((field) => {
            if (field.required) {
                const value = formValues[field.id];
                if (value === undefined || value === null) {
                    throw new Error(localInstance.please_fill_required_fields.format(` ${field.label}`));
                }
                if (typeof value === 'string' && Strings.isEmpty(value)) {
                    throw new Error(localInstance.please_fill_required_fields.format(` ${field.label}`));
                }
                if (Array.isArray(value) && value.length === 0) {
                    throw new Error(localInstance.please_fill_required_fields.format(` ${field.label}`));
                }
            }
        });
    }

    public static validateField(field: IFormField) {
        const isSelect = [FormFieldType.SELECT, FormFieldType.RADIO].includes(field.type);
        if (isSelect) {
            const optionField = field as IOptionsField;
            const conditions = optionField.options || [];
            if (conditions.length === 0) {
                return {
                    valid: false,
                    message: localInstance.please_add_list_item,
                };
            }

            let errMessage = "";
            const enableCustomValue = optionField.enableCustomValue === true;
            const hasEmptyValue = conditions.some((c, index) => {
                let isEmpty;
                if (enableCustomValue) {
                    isEmpty = Strings.isEmpty(c.value);
                } else {
                    isEmpty = Strings.isEmpty(c.label);
                }
                errMessage = localInstance.please_fill_list_item_value.format((index + 1) + "");
                return isEmpty;
            });
            if (hasEmptyValue) {
                return {
                    valid: false,
                    message: errMessage,
                };
            }

            const hasDuplicate = conditions.some((c, index) => {
                const other = conditions.some((o, i) => {
                    if (i === index) return false;
                    if (enableCustomValue) {
                        return o.value === c.value;
                    } else {
                        return o.label === c.label;
                    }
                });
                if (other) {
                    const v = enableCustomValue ? c.value : c.label;
                    errMessage = localInstance.please_ensure_there_are_no_duplicate_item.format(v + "")
                }
                return other;
            });
            if (hasDuplicate) {
                return {
                    valid: false,
                    message: errMessage
                };
            }
        }

        return {
            valid: true,
            message: 'ok',
        }
    }
}