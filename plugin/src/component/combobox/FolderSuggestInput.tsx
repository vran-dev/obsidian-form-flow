import { Folder } from "lucide-react";
import { useMemo } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import ComboboxSuggestion from "./ComboboxSuggestion";

export default function (props: {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const app = useObsidianApp();
	const { value, onChange } = props;

	const items = useMemo(() => {
		const folders = app.vault.getAllFolders();

		const options = folders.map((f) => {
			return {
				value: f.path,
				label: f.path,
				icon: <Folder size={14} />,
			};
		});
		return options;
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
