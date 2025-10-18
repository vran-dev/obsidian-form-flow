import { localInstance } from "src/i18n/locals";
import { FileConflictResolution } from "src/model/enums/FileConflictResolution";

export default function (props: {
	value?: FileConflictResolution;
	onChange: (value: FileConflictResolution) => void;
}) {
	const { value } = props;
	return (
		<select
			className="dropdown"
			value={value || FileConflictResolution.SKIP}
			onChange={(e) => props.onChange(e.target.value as FileConflictResolution)}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

const options = [
	{
		label: localInstance.file_conflict_resolution_skip,
		value: FileConflictResolution.SKIP,
	},
	{
		label: localInstance.file_conflict_resolution_auto_rename,
		value: FileConflictResolution.AUTO_RENAME,
	},
	{
		label: localInstance.file_conflict_resolution_overwrite,
		value: FileConflictResolution.OVERWRITE,
	},
];