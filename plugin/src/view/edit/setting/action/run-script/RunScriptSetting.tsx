import { localInstance } from "src/i18n/locals";
import {
	IFormAction,
	DEFAULT_CODE_FOR_ACTION,
} from "src/model/action/IFormAction";
import {
	RunScriptFormAction,
	ScriptSourceType,
} from "src/model/action/RunScriptFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";
import CodeEditor from "../common/code-editor/CodeEditor";
import ScriptSourceSelect from "./ScriptSourceSelect";
import { formScriptService } from "src/service/extend/FormScriptService";
import ExtensionEditor from "src/component/extension-editor/ExtensionEditor";

export function RunScriptSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const extensions = formScriptService.getFunctions();
	const { value } = props;

	if (value.type !== FormActionType.RUN_SCRIPT) {
		return null;
	}

	const action = value as RunScriptFormAction;
	return (
		<>
			{/* {action.scriptSource === ScriptSourceType.INLINE && (
				<CpsFormItem label={localInstance.title}>
					<input
						type="text"
						placeholder={localInstance.brief_description}
						value={action.title || ""}
						onChange={(e) => {
							const newAction = {
								...action,
								title: e.target.value,
							};
							props.onChange(newAction);
						}}
					/>
				</CpsFormItem>
			)} */}
			<CpsFormItem label={localInstance.source}>
				<ScriptSourceSelect
					value={action.scriptSource || ScriptSourceType.EXTENSION}
					onChange={(value) => {
						const newAction = {
							...action,
							scriptSource: value,
						};
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>
			{action.scriptSource === ScriptSourceType.INLINE ? (
				<>
					<CpsFormItem label={""}>
						<button
							onClick={(e) => {
								e.preventDefault();
								const newAction = {
									...action,
									code: DEFAULT_CODE_FOR_ACTION,
								};
								props.onChange(newAction);
							}}
							className="form-CpsFormActinoCodeResetButton"
						>
							{localInstance.reset_code}
						</button>
					</CpsFormItem>
					<CodeEditor
						initialValue={action.code || DEFAULT_CODE_FOR_ACTION}
						onChange={(code) => {
							const newAction = {
								...action,
								code: code,
							};
							props.onChange(newAction);
						}}
						height="680px"
					/>
				</>
			) : (
				<div>
					<ExtensionEditor
						value={action.expression}
						onChange={(value: string) => {
							const newAction = {
								...action,
								expression: value,
							};
							props.onChange(newAction);
						}}
						extensions={extensions}
					/>
				</div>
			)}
		</>
	);
}
