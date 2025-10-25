import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";

import { DEFAULT_CODE_FOR_ACTION, IFormAction } from "./IFormAction";

export class RunScriptFormAction extends BaseFormAction {
    type: FormActionType.RUN_SCRIPT;
    /**
     * for inline script
     */
    title?: string;
    variales: Variable[];
    scriptSource: ScriptSourceType;
    expression: string;
    code: string;

    constructor(partial?: Partial<RunScriptFormAction>) {
        super(partial);
        this.type = FormActionType.RUN_SCRIPT;
        this.variales = [];
        this.scriptSource = ScriptSourceType.INLINE;
        this.expression = "";
        this.code = DEFAULT_CODE_FOR_ACTION;
        Object.assign(this, partial);
    }
}

export interface Variable {
    name: string;
    value: string;
}

export enum ScriptSourceType {
    EXTENSION = "extension",
    INLINE = "inline"
}