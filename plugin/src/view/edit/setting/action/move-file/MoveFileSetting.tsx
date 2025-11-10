import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { FilePathFormItem } from "../common/FilePathFormItem";
import TargetFileTypeSelect from "../common/TargetFileTypeSelect";
import { TargetFileType } from "src/model/enums/TargetFileType";
import FolderSuggestInput from "src/component/combobox/FolderSuggestInput";

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
			<CpsFormItem label={localInstance.target_file}>
				<TargetFileTypeSelect
					value={action.targetFileType}
					onChange={(value) => {
						const newAction = { ...action, targetFileType: value };
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>
			{action.targetFileType === TargetFileType.CURRENT_FILE ? (
				<></>
			) : (
				<>
					<FilePathFormItem
						label={""}
						value={action.filePath}
						onChange={(value) => {
							const newAction = {
								...action,
								filePath: value,
							};
							props.onChange(newAction);
						}}
					/>
				</>
			)}

			<CpsFormItem label={localInstance.target_folder}>
				<FolderSuggestInput
					value={action.targetFolder}
					onChange={(v: string) => set({ targetFolder: v })}
				/>
			</CpsFormItem>
		</>
	);
}