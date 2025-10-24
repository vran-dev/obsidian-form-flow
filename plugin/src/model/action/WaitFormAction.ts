import { FormActionType } from "../enums/FormActionType";
import { WaitTimeUnit } from "../enums/WaitTimeUnit";
import { IFormAction } from "./IFormAction";

export interface WaitFormAction extends IFormAction {
    type: FormActionType.WAIT;
    
    /**
     * Wait time in the specified unit
     * Default: 300ms
     */
    waitTime: number;
    
    /**
     * Time unit for wait time
     * Default: milliseconds
     */
    unit: WaitTimeUnit;
}

export const DEFAULT_WAIT_TIME = 300;
export const DEFAULT_WAIT_UNIT = WaitTimeUnit.MILLISECONDS;