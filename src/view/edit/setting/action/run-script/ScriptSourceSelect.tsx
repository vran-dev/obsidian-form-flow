import RadioSelect from "src/component/radio/RadioSelect";
import { localInstance } from "src/i18n/locals";
import { ScriptSourceType } from "src/model/action/RunScriptFormAction";

export default function (props: {
	value: string;
	onChange: (value: ScriptSourceType) => void;
}) {
	const { value, onChange } = props;
	return (
		<RadioSelect
			value={value}
			onChange={onChange}
			options={scriptSourceOptions}
		/>
	);
}

const scriptSourceOptions = [
	{
		id: "script_source_file",
		value: ScriptSourceType.EXTENSION,
		label: localInstance.source_extension,
	},
	{
		id: "script_source_code",
		value: ScriptSourceType.INLINE,
		label: localInstance.source_code,
	},
];
