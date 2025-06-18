import ComboboxSuggestion from "src/component/combobox/ComboboxSuggestion";
import { MultipleComboboxSuggestion } from "src/component/combobox/MultipleComboboxSuggestion";
import { useObsidianApp } from "src/context/obsidianAppContext";
import useFormConfig from "src/hooks/useFormConfig";
import { useVariables } from "src/hooks/useVariables";
import { isMultiTextProperty } from "src/utils/isMultiTextProperty";
import { Strings } from "src/utils/Strings";

type Props = {
	name?: string;
	actionId: string;
	value: any;
	onChange: (value: any) => void;
	placeholder?: string;
};

export function PropertyUpdateValueInput(props: Props) {
	const { name, value, onChange, actionId } = props;
	const formConfig = useFormConfig();
	const variables = useVariables(actionId, formConfig);
	const app = useObsidianApp();
	const isMultiple = isMultiTextProperty(app, name);
	const options = variables.map((v) => {
		return {
			value: `{{@${v.label}}}`,
			label: v.label,
			description: v.info,
		};
	});

	if (isMultiple) {
		let arrayValue;
		if (Array.isArray(value)) {
			arrayValue = value;
		} else {
			arrayValue = Strings.isEmpty(value) ? [] : [value];
		}

		return (
			<MultipleComboboxSuggestion
				value={arrayValue}
				onChange={(v) => {
					onChange(v);
				}}
				options={options}
			/>
		);
	}

	let singleValue;
	if (Array.isArray(value)) {
		singleValue = value[0];
	} else {
		singleValue = value;
	}

	return (
		<ComboboxSuggestion
			value={singleValue}
			placeholder={props.placeholder}
			onChange={(value) => {
				onChange(value);
			}}
			options={options}
		/>
	);
}
