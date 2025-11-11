import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { FilePathFormItem } from "../common/FilePathFormItem";
export function MoveFileSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.MOVE_FILE) {
		return null;
	}
	const action = value as MoveFileFormAction;

	const set = (patch: Partial<MoveFileFormAction>) =>
		props.onChange({ ...action, ...patch } as IFormAction);

	return (
		<>
			<CpsFormItem label={localInstance.is_current_file}>
				<input
					type="checkbox"
					checked={!!action.isCurrentFile}
					onChange={(e) => set({ isCurrentFile: e.target.checked })}
				/>
			</CpsFormItem>

			{!action.isCurrentFile && (
				<CpsFormItem label="Source File">
					<FilePathFormItem
						label={localInstance.source_file}
						value={action.file || ""}
						onChange={(v: string) => set({ file: v })}
					/>
				</CpsFormItem>
			)}

			<CpsFormItem label="Target Folder">
				<FilePathFormItem
					label={localInstance.target_folder}
					value={action.targetFolder || ""}
					onChange={(v: string) => set({ targetFolder: v })}
				/>
			</CpsFormItem>
		</>
	);
}