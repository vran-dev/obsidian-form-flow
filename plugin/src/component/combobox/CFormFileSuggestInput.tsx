import { TFile, TFolder } from "obsidian";
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
		const cformFiles = app.vault.getAllLoadedFiles().filter((f) => {
			if (f instanceof TFolder) {
				return false;
			}
			if (f instanceof TFile) {
				return f.extension === "cform";
			}
			return false;
		});
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
