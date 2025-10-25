import { FormActionType } from "../enums/FormActionType";
import { IFormField } from "../field/IFormField";
import { IFormAction } from "./IFormAction";

/**
 * @deprecated
 */
export interface GenerateFormAction extends IFormAction {
    type: FormActionType.GENERATE_FORM
    fields: IFormField[];
}

