import { OperatorType } from "src/model/filter/OperatorType";

export function normalizeValue(operator: OperatorType, value: any): any {
	if (
		operator === OperatorType.Contains ||
		operator === OperatorType.NotContains
	) {
		return Array.isArray(value) ? value : [value];
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return null;
		}
		return value[0];
	}

	return value;
}
