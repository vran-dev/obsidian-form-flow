import { Filter } from "src/model/filter/Filter";

export interface OperatorHandler {

    accept(filter: Filter): boolean;

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean;

}

export interface OperatorHandleContext {
    filter: Filter;
}