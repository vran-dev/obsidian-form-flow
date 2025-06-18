import { Objects } from "src/utils/Objects";
import { Strings } from "src/utils/Strings";
import { OperatorHandlers } from "./handler/OperatorHandlers";
import { Filter, FilterType } from "src/model/filter/Filter";
import { RelationType, OperatorType } from "src/model/filter/OperatorType";

export class FilterService {

    static match(
        root: Filter,
        getFieldValue: (property?: string) => any,
        getValue: (value?: any) => any,
    ): boolean {

        if (!root) {
            return true;
        }

        if (root.type === FilterType.group) {
            if (!root.conditions || root.conditions.length === 0) {
                return true;
            }

            const relation = root.operator as RelationType;
            if (relation === OperatorType.And) {
                return root.conditions.every((condition) => {
                    return FilterService.match(condition, getFieldValue, getValue);
                });
            } else {
                return root.conditions.some((condition) => {
                    return FilterService.match(condition, getFieldValue, getValue);
                });
            }
        } else {
            if (Strings.isEmpty(root.property)) {
                return true;
            }
            if (Objects.isNullOrUndefined(root.operator)) {
                return true;
            }
            const fieldValue = getFieldValue(root.property);
            const value = getValue(root.value);

            return OperatorHandlers.apply(root, fieldValue, value);
        }
    }

}