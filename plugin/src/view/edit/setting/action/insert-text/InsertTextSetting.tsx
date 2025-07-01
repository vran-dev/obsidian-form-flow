import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { TextInsertPosition } from "src/model/enums/TextInsertPosition";
import { getFilePathCompatible } from "src/utils/getFilePathCompatible";
import { Strings } from "src/utils/Strings";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { FilePathFormItem } from "../common/FilePathFormItem";
import InsertPositionSelect from "../common/InsertPositionSelect";
import OpenPageTypeSelect from "../common/OpenPageTypeSelect";
import TargetFileTypeSelect from "../common/TargetFileTypeSelect";
import TextAreaContentSetting from "../common/TextAreaContentSetting";

export function InsertTextSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.INSERT_TEXT) {
		return null;
	}
	const action = value as InsertTextFormAction;
	const isHeadingPosition = [
		TextInsertPosition.TOP_BELOW_TITLE,
		TextInsertPosition.BOTTOM_BELOW_TITLE,
	].includes(action.position);

	const targetFilePath = getFilePathCompatible(action);
	const showFileTemplateSuggeest =
		action.targetFileType !== TargetFileType.CURRENT_FILE &&
		Strings.isNotBlank(targetFilePath);

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
						value={targetFilePath}
						onChange={(value) => {
							const newAction = {
								...action,
								filePath: value,
							};
							props.onChange(newAction);
						}}
					/>
					<CpsFormItem
						label={localInstance.open_file_after_submitted}
					>
						<OpenPageTypeSelect
							value={action.openPageIn}
							onChange={(value) => {
								const newAction = {
									...action,
									openPageIn: value,
								};
								props.onChange(newAction);
							}}
						/>
					</CpsFormItem>
				</>
			)}
			{showFileTemplateSuggeest && (
				<FilePathFormItem
					label={localInstance.create_from_template}
					value={action.newFileTemplate || ""}
					placeholder={
						localInstance.select_template +
						`(${localInstance.optional})`
					}
					onChange={(value) => {
						const newAction = {
							...action,
							newFileTemplate: value,
						};
						props.onChange(newAction);
					}}
				/>
			)}

			<CpsFormItem label={localInstance.insert_position}>
				<InsertPositionSelect
					targetFileType={action.targetFileType}
					value={action.position}
					onChange={(value) => {
						const newAction = { ...action, position: value };
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>

			{isHeadingPosition && (
				<CpsFormItem label={localInstance.heading}>
					<input
						type="text"
						placeholder={localInstance.heading_placeholder}
						value={action.heading}
						onChange={(e) => {
							const newAction = {
								...action,
								heading: e.target.value,
							};
							props.onChange(newAction);
						}}
					/>
				</CpsFormItem>
			)}

			<TextAreaContentSetting
				actionId={action.id}
				content={action.content}
				onChange={(v) => {
					const newAction = {
						...action,
						content: v,
					};
					props.onChange(newAction);
				}}
			/>
		</>
	);
}
