import RadioSelect from "src/component/radio/RadioSelect";
import { localInstance } from "src/i18n/locals";
import { TargetFileType } from "src/model/enums/TargetFileType";

export default function (props: {
	value: string;
	onChange: (value: TargetFileType) => void;
}) {
	const { value, onChange } = props;
	return (
		<RadioSelect
			value={value || TargetFileType.SPECIFIED_FILE}
			onChange={onChange}
			options={insertTargetFileTypeOptions}
		/>
	);
}

const insertTargetFileTypeOptions = [
	{
		id: TargetFileType.SPECIFIED_FILE,
		value: TargetFileType.SPECIFIED_FILE,
		label: localInstance.in_specified_file,
	},
	{
		id: TargetFileType.CURRENT_FILE,
		value: TargetFileType.CURRENT_FILE,
		label: localInstance.in_current_file,
	},
];
