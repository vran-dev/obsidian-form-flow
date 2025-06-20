import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { OperatorHandleContext, OperatorHandler } from "../OperatorHandler";

export class EqOperatorHandler implements OperatorHandler {

    accept(filter: Filter) {
        return filter.operator === OperatorType.Equals;
    }

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean {
        if (Array.isArray(fieldValue) && Array.isArray(value)) {
            if (fieldValue.length !== value.length) {
                return false;
            }
            return fieldValue.every((v) => value.includes(v));
        }

        return fieldValue === value;
    }

}
