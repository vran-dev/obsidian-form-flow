import { Code, File, FileJson, MessageSquare, Text } from "lucide-react";
import { localInstance } from "src/i18n/locals";
import { FormActionType } from "src/model/enums/FormActionType";
import { FormTypeSelect } from "src/view/shared/select/FormTypeSelect";

export default function (props: {
	value: string;
	onChange: (value: FormActionType) => void;
	styles?: Record<string, string>;
}) {
	const { value } = props;
	const options = formActionTypeOptions.map((option) => ({
		...option,
		id: option.value,
	}));
	return (
		<FormTypeSelect
			value={value}
			onChange={props.onChange}
			options={options}
			styles={props.styles}
		/>
	);
}

export const formActionTypeOptions = [
	{
		value: FormActionType.CREATE_FILE,
		label: localInstance.create_file,
		icon: <File />,
	},
	{
		value: FormActionType.INSERT_TEXT,
		label: localInstance.insert_text,
		icon: <Text />,
	},
	{
		value: FormActionType.UPDATE_FRONTMATTER,
		label: localInstance.update_property,
		icon: <FileJson />,
	},
	// {
	// 	value: FormActionType.GENERATE_FORM,
	// 	label: localInstance.generate_form,
	// 	icon: <Clipboard />,
	// },
	{
		value: FormActionType.SUGGEST_MODAL,
		label: localInstance.suggest_modal,
		icon: <MessageSquare />,
	},
	{
		value: FormActionType.RUN_SCRIPT,
		label: localInstance.run_script,
		icon: <Code />,
	},
];
