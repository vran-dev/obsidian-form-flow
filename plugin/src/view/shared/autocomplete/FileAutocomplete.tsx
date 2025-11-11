import { FileIcon } from "lucide-react";
import { TFile } from "obsidian";
import { useCallback } from "react";
import { Autocomplete } from "src/component/autocomplete/Autocomplete";
import { useObsidianApp } from "src/context/obsidianAppContext";

export function FileAutocomplete(props: {
	label: string;
	file?: string;
	onChange: (file: string) => void;
}): JSX.Element {
	const app = useObsidianApp();
	const { file, label, onChange } = props;

	const getFiles = useCallback(() => {
		const files = app.vault.getMarkdownFiles();
		return files.map((f: TFile) => {
			return {
				id: f.path,
				value: f.path,
				label: f.name,
				icon: <FileIcon size={14} />,
			};
		});
	}, []);
	return (
		<Autocomplete
			label={label}
			value={file || ""}
			onSelect={(value: string) => {
				if (!value) {
					onChange("");
					return;
				}

				onChange(value);
			}}
			getOptions={getFiles}
		/>
	);
}
