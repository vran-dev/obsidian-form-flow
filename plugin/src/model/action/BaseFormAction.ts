import { v4 } from "uuid";
import { FormActionType } from "../enums/FormActionType";
import { Filter } from "../filter/Filter";
import { IFormAction } from "./IFormAction";

export abstract class BaseFormAction implements IFormAction {
    id: string;
    condition?: Filter | null | undefined;
    remark?: string | undefined;

    abstract type: FormActionType;
    
    constructor(partial?: Partial<IFormAction>) {
        this.id = v4();
        
        Object.assign(this, partial);
    }
}