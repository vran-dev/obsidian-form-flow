import { FormFieldType } from "../enums/FormFieldType";
import { IFormField } from "./IFormField";

export interface IFolderPathField extends IFormField {
    type: FormFieldType.FOLDER_PATH;
}