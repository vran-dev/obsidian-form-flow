import { normalizePath } from "obsidian";
import { useMemo, useState } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import FolderSuggestInput from "../combobox/FolderSuggestInput";
import "./CreateFileForm.css";

type Props = {
	fileType: string;
	defaultBasename?: string;
	defaultTargetFolder?: string;
	onSubmit: (fileName: string, targetFolder: string) => Promise<void>;
	onCancel?: () => void;
};

export function CreateFileForm(props: Props) {
	const app = useObsidianApp();
	const [formState, setFormState] = useState({
		fileName: props.defaultBasename || "",
		targetFolder: props.defaultTargetFolder || "",
	});

	const filePath = useMemo(() => {
		const name = formState.fileName + "." + props.fileType;
		const folder = normalizePath(formState.targetFolder || "");
		return normalizePath(folder ? `${folder}/${name}` : name);
	}, [formState]);

	const isConflict = app.vault.getAbstractFileByPath(filePath) !== null;
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isConflict && formState.fileName) {
			props.onSubmit(
				formState.fileName + "." + props.fileType,
				formState.targetFolder
			);
		}
	};
	return (
		<form className="form--CreateFileForm" onSubmit={handleSubmit}>
			<div className="form--CreateFileFormItem">
				<div className="form--CreateFileFormItemLabel">
					{localInstance.file_basename}
				</div>
				<div className="form--CreateFileFormItemControl">
					<input
						type="text"
						defaultValue={formState.fileName}
						onChange={(e) => {
							setFormState({
								...formState,
								fileName: e.target.value,
							});
						}}
						autoFocus={true}
						required={true}
					/>
				</div>
			</div>

			<div className="form--CreateFileFormItem">
				<div className="form--CreateFileFormItemLabel">
					{localInstance.folder}
				</div>
				<div className="form--CreateFileFormItemControl">
					<FolderSuggestInput
						value={formState.targetFolder}
						onChange={(value) => {
							setFormState({
								...formState,
								targetFolder: value,
							});
						}}
					/>
				</div>
			</div>
			<div className="form--CreateFileFormItem">
				<div className="form--CreateFileFormItemLabel">
					{isConflict && (
						<span className="tag">
							{localInstance.file_name_conflict}
						</span>
					)}
					{filePath}
				</div>
			</div>
			<div className="form--CreateFileFormFooter">
				{props.onCancel && (
					<button
						type="button"
						className="form--TextButton"
						onClick={() => {
							props.onCancel?.();
						}}
					>
						{localInstance.cancel}
					</button>
				)}
				<button type="submit" className="mod-cta" disabled={isConflict}>
					{localInstance.create_file}
				</button>
			</div>
		</form>
	);
}
