import { localInstance } from "src/i18n/locals";
import {
	CreateFileFormAction,
	ContentTemplateSource,
} from "src/model/action/CreateFileFormAction";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { getFilePathCompatible } from "src/utils/getFilePathCompatible";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { FilePathFormItem } from "../common/FilePathFormItem";
import OpenPageTypeSelect from "../common/OpenPageTypeSelect";
import TextAreaContentSetting from "../common/TextAreaContentSetting";
import ContentTemplateSourceSelect from "./ContentTemplateSourceSelect";

export function CreateFileSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.CREATE_FILE) {
		return null;
	}
	const action = value as CreateFileFormAction;
	const targetFilePath = getFilePathCompatible(action);
	return (
		<>
			<CpsFormItem label={localInstance.open_file_after_submitted}>
				<OpenPageTypeSelect
					value={action.openPageIn}
					onChange={(value) => {
						const newAction = { ...action, openPageIn: value };
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>
			<FilePathFormItem
				label={localInstance.file_path}
				value={targetFilePath}
				onChange={(value) => {
					const newAction = {
						...action,
						filePath: value,
					};
					props.onChange(newAction);
				}}
			/>

			<CpsFormItem label={localInstance.content_template}>
				<ContentTemplateSourceSelect
					value={
						action.contentTemplateSource ||
						ContentTemplateSource.TEXT
					}
					onChange={(v) => {
						const newAction = {
							...action,
							contentTemplateSource: v,
						};
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>

			{action.contentTemplateSource === ContentTemplateSource.FILE ? (
				<FilePathFormItem
					label={""}
					value={action.templateFile}
					onChange={(value) => {
						const newAction = {
							...action,
							templateFile: value,
						};
						props.onChange(newAction);
					}}
				/>
			) : (
				<TextAreaContentSetting
					actionId={action.id}
					content={action.content}
					onChange={(value) => {
						const newAction = { ...action, content: value };
						props.onChange(newAction);
					}}
				/>
			)}
		</>
	);
}
