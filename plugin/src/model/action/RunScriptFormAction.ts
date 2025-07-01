import { FormActionType } from "../enums/FormActionType";

import { IFormAction } from "./IFormAction";

export interface RunScriptFormAction extends IFormAction {
    type: FormActionType.RUN_SCRIPT;
    /**
     * for inline script
     */
    title?: string;
    variales: Variable[];
    scriptSource: ScriptSourceType;
    expression: string;
    code: string;
}

export interface Variable {
    name: string;
    value: string;
}

export enum ScriptSourceType {
    EXTENSION = "extension",
    INLINE = "inline"
}