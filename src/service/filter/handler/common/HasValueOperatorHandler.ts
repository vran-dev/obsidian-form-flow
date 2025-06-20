import { Objects } from "src/utils/Objects";
import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { OperatorHandleContext, OperatorHandler } from "../OperatorHandler";

export class HasValueOperatorHandler implements OperatorHandler {

    accept(filter: Filter) {
        return filter.operator === OperatorType.HasValue;
    }

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean {
        if (Objects.isNullOrUndefined(fieldValue)) {
            return false;
        }
        if (Array.isArray(fieldValue)) {
            return fieldValue.length > 0;
        }
        if (typeof fieldValue === "string") {
            return fieldValue.length > 0;
        }
        return true;
    }

}
