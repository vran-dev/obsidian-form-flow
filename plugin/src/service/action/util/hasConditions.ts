import { IFormAction } from "src/model/action/IFormAction";

export function hasConditions(action: IFormAction): boolean {
    if (action.condition) {
        const conditions = action.condition.conditions || [];
        return conditions.length > 0;
    }
    return false;
}
