import { useMemo } from "react";
import useFormConfig from "src/hooks/useFormConfig";
import { useVariables } from "src/hooks/useVariables";
import { localInstance } from "src/i18n/locals";
import CpsFormItem from "src/view/shared/CpsFormItem";
import CodeEditor from "./code-editor/CodeEditor";
import { timeTemplatePreviewExtension } from "./code-editor/FormTimeVariableWidget";
import { createFormVariableSuggestions } from "./code-editor/FormVariableSuggest";
import { formVariableExtension } from "./code-editor/FormVariableWidget";
import { internalFieldNames } from "./variable-quoter/InternalVariablePopover";

export default function (props: {
	actionId: string;
	content: string;
	placeholder?: string;
	onChange: (value: string) => void;
}) {
	const { actionId, content, onChange } = props;
	const formConfig = useFormConfig();
	const internalVariableNames = internalFieldNames.map((f) => {
		return {
			label: f.name,
			detail: f.description,
		};
	});

	const fieldNames = useVariables(actionId, formConfig);
	const extensionKey = useMemo(() => {
		return fieldNames.map((f) => f.label).join("|");
	}, [fieldNames]);

	const editorExtensions = useMemo(() => {
		return [
			formVariableExtension,
			createFormVariableSuggestions(fieldNames),
			timeTemplatePreviewExtension,
		];
	}, [fieldNames]);

	return (
		<CpsFormItem
			label={localInstance.text_content}
			style={{
				flexDirection: "column",
				alignItems: "initial",
			}}
		>
			<CodeEditor
				height="500px"
				initialValue={content || ""}
				onChange={(value) => {
					onChange(value);
				}}
				language="markdown"
				extensions={editorExtensions}
				extensionsKey={extensionKey}
			/>
		</CpsFormItem>
	);
}
