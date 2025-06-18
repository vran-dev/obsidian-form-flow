import { useMemo } from "react";
import ComboboxSuggestion from "./ComboboxSuggestion";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { getAllProperties } from "src/utils/getAllProperties";

export function PropertyNameSuggestInput(props: {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}) {
	const app = useObsidianApp();
	const { value, onChange } = props;
	const items = useMemo(() => {
		const values = getAllProperties(app).map((p) => {
			return {
				label: p.name,
				value: p.name,
			};
		});
		return values;
	}, []);

	return (
		<ComboboxSuggestion
			value={value}
			onChange={onChange}
			options={items}
			placeholder={props.placeholder}
		/>
	);
}
