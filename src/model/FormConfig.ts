import { v4 } from "uuid";
import { IFormAction } from "./action/IFormAction";
import { FormActionType } from "./enums/FormActionType";
import { IFormField } from "./field/IFormField";

export class FormConfig {
    id: string;
    fields: IFormField[];
    /**
     * @deprecated
     */
    action?: IFormAction;
    actions: IFormAction[];
    autoSubmit: boolean;

    constructor(id: string) {
        this.id = id;
        this.fields = [];
        const createFileAction = {
            id: v4(),
            type: FormActionType.CREATE_FILE,
            targetFolder: "",
            fileName: "",
        }
        this.actions = [createFileAction];
        this.autoSubmit = false;
    }
}
