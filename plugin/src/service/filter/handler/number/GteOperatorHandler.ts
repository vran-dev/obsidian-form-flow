import { Objects } from "src/utils/Objects";
import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { OperatorHandleContext, OperatorHandler } from "../OperatorHandler";

export class GteOperatorHandler implements OperatorHandler {

    accept(filter: Filter) {
        return filter.operator === OperatorType.GreaterThanOrEqual;
    }

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean {
        if (Objects.isNullOrUndefined(fieldValue) || Objects.isNullOrUndefined(value)) {
            return false;
        }
        return fieldValue >= value;
    }

}
