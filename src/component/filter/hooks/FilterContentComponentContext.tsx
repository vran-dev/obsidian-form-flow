import { createContext, useContext } from "react";
import { Filter } from "src/model/filter/Filter";

export type FilterContentComponent = React.FC<{
	filter: Filter;
	onChange: (filter: Filter) => void;
}>;

export const FilterContentComponentContext = createContext<
	FilterContentComponent | undefined
>(undefined);

export const useFilterContentComponent = (): FilterContentComponent => {
	const component = useContext(FilterContentComponentContext);
	if (!component) {
		throw new Error(
			"useFilterContentComponent must be used within a FilterContentComponentContext"
		);
	}
	return component;
};
