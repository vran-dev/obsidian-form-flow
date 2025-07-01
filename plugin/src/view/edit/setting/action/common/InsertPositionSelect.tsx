import { localInstance } from "src/i18n/locals";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { TextInsertPosition } from "src/model/enums/TextInsertPosition";

export default function (props: {
	targetFileType?: TargetFileType;
	value: string;
	onChange: (value: TextInsertPosition) => void;
}) {
	const { value } = props;
	let options;
	if (props.targetFileType === TargetFileType.CURRENT_FILE) {
		options = allFormInsertPositionOptions;
	} else {
		options = formInsertPositionOptions;
	}
	return (
		<select
			className="dropdown"
			value={value || TextInsertPosition.END_OF_CONTENT}
			onChange={(e) =>
				props.onChange(e.target.value as TextInsertPosition)
			}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

const formInsertPositionOptions = [
	{
		value: TextInsertPosition.END_OF_CONTENT,
		label: localInstance.end_of_content,
	},
	{
		value: TextInsertPosition.TOP_OF_CONTENT,
		label: localInstance.top_of_content,
	},
	{
		value: TextInsertPosition.BOTTOM_BELOW_TITLE,
		label: localInstance.bottom_below_title,
	},
	{
		value: TextInsertPosition.TOP_BELOW_TITLE,
		label: localInstance.top_below_title,
	},
];

export const allFormInsertPositionOptions = [
	{
		value: TextInsertPosition.AT_CURSOR,
		label: localInstance.at_cursor,
	},
	...formInsertPositionOptions,
];
