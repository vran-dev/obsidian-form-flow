import { OperatorType } from "./OperatorType";

export interface Filter {

	id: string;

	type: FilterType

	operator: OperatorType;

	property?: string;

	value?: any;

	conditions: Filter[];

}

export enum FilterType {
	group = "group",
	filter = "filter",
	jsQuery = "jsQuery",
}
