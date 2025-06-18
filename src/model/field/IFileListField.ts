import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface IFileListField extends IFormField {
    type: FormFieldType.FILE_LIST;
    internalLink?: boolean;
    multiple?: boolean;
}