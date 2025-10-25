import { FormActionType } from "../enums/FormActionType";
import { BaseFormAction } from "./BaseFormAction";

export class WaitFormAction extends BaseFormAction {
    type: FormActionType.WAIT;

    /**
     * Wait time in milliseconds
     * Default: 300ms if not specified
     */
    waitTime?: number;

    /**
     * Time unit for wait time
     * Currently only "milliseconds" unit is supported
     * Default: milliseconds
     */
    unit: "milliseconds";

    constructor(partial?: Partial<WaitFormAction>) {
        super(partial);
        this.type = FormActionType.WAIT;
        this.waitTime = DEFAULT_WAIT_TIME;
        this.unit = DEFAULT_WAIT_UNIT;
        Object.assign(this, partial);
    }
}

export const DEFAULT_WAIT_TIME = 300;
export const DEFAULT_WAIT_UNIT = "milliseconds";