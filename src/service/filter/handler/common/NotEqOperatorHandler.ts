import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { OperatorHandleContext, OperatorHandler } from "../OperatorHandler";

export class NotEqOperatorHandler implements OperatorHandler {

    accept(filter: Filter) {
        return filter.operator === OperatorType.NotEquals;
    }

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean {
        if (Array.isArray(fieldValue) && Array.isArray(value)) {
            if (fieldValue.length !== value.length) {
                return true;
            }
            return fieldValue.some((v) => !value.includes(v));
        }
        return fieldValue !== value;
    }

}
