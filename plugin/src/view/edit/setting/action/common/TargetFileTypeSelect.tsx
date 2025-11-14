import RadioSelect from "src/component/radio/RadioSelect";
import { localInstance } from "src/i18n/locals";
import { TargetFileType } from "src/model/enums/TargetFileType";

export default function (props: {
	value: string;
	onChange: (value: TargetFileType) => void;
	operationOnFile?: boolean;
}) {
	const { value, onChange, operationOnFile } = props;
	return (
		operationOnFile?<RadioSelect
			value={value || TargetFileType.CURRENT_FILE}
			onChange={onChange}
			options={moveTargetFileTypeOptions}
		/>:<RadioSelect
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

const moveTargetFileTypeOptions = [
	{
		id: TargetFileType.SPECIFIED_FILE,
		value: TargetFileType.SPECIFIED_FILE,
		label: localInstance.operate_on_specified_file,
	},
	{
		id: TargetFileType.CURRENT_FILE,
		value: TargetFileType.CURRENT_FILE,
		label: localInstance.operate_on_current_file,
	},
];