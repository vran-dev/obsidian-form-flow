import { FormActionType } from "../enums/FormActionType";
import { IFormAction } from "./IFormAction";

export interface WaitFormAction extends IFormAction {
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
}

export const DEFAULT_WAIT_TIME = 300;
export const DEFAULT_WAIT_UNIT = "milliseconds";