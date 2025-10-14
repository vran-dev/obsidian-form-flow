import { FormFieldType } from "../enums/FormFieldType";
import { ICheckboxField } from "./ICheckboxField";
import { IDateField } from "./time/IDateField";
import { IDateTimeField } from "./time/IDateTimeField";
import { INumberField } from "./INumberField";
import { IPasswordField } from "./IPasswordField";
import { IPropertyValueField } from "./IPropertyValueField";
import { IRadioField } from "./IRadioField";
import { ISelectField } from "./ISelectField";
import { ITextAreaField } from "./ITextAreaField";
import { ITextField } from "./ITextField";
import { IToggleField } from "./IToggleField";
import { IFileListField } from "./IFileListField";
import { IFolderPathField } from "./IFolderPathField";
import { Filter } from "../filter/Filter";

export interface IFormField {
    id: string;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    description?: string;
    defaultValue?: any;
    required?: boolean;
    enableDescription?: boolean;
    condition?: Filter;
}

export type FormField =
    | ITextField
    | ITextAreaField
    | IPasswordField
    | INumberField
    | IDateField
    | IDateTimeField
    | IDateTimeField
    | ICheckboxField
    | IToggleField
    | IRadioField
    | ISelectField
    | IPropertyValueField
    | IFileListField
    | IFolderPathField