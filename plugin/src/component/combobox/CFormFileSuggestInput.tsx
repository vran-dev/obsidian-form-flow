import { useMemo } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import ComboboxSuggestion from "./ComboboxSuggestion";

export default function (props: {
	value: string;
	onChange: (value: string) => void;
}) {
	const app = useObsidianApp();
	const { value, onChange } = props;
	const items = useMemo(() => {
		const cformFiles = app.vault.getFiles().filter((f) => f.extension === "cform");
		const options = cformFiles.map((f) => {
			return {
				value: f.path,
				label: f.name,
				description: f.path,
			};
		});
		return options;
	}, []);

	return (
		<ComboboxSuggestion value={value} onChange={onChange} options={items} />
	);
}
