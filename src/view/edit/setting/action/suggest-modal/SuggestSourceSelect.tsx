import RadioSelect from "src/component/radio/RadioSelect";
import { localInstance } from "src/i18n/locals";
import { SuggestSource } from "src/model/action/SuggestModalFormAction";

export function SuggestSourceSelect(props: {
	value: string;
	onChange: (value: SuggestSource) => void;
}) {
	const { value, onChange } = props;
	return (
		<RadioSelect
			value={value}
			onChange={onChange}
			options={suggestSourceOptions}
		/>
	);
}

const suggestSourceOptions = [
	{
		id: SuggestSource.LIST,
		value: SuggestSource.LIST,
		label: localInstance.list,
	},
	{
		id: SuggestSource.SCRIPT,
		value: SuggestSource.SCRIPT,
		label: localInstance.source_code,
	},
];
