import { Objects } from "src/utils/Objects";
import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { OperatorHandleContext, OperatorHandler } from "../OperatorHandler";

export class ContainsOperatorHandler implements OperatorHandler {

    accept(filter: Filter) {
        return filter.operator === OperatorType.Contains;
    }

    apply(fieldValue: any, value: any, context: OperatorHandleContext): boolean {
        if (Objects.isNullOrUndefined(value)) {
            return true;
        }
        const arrayValue = Array.isArray(value) ? value : [value];
        if (arrayValue.length === 0) {
            return true;
        }
        const arrayFieldValue = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        return arrayFieldValue.some((item: any) => arrayValue.includes(item));
    }

}
