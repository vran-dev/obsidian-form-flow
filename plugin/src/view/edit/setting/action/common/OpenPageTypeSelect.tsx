import { localInstance } from "src/i18n/locals";
import { OpenPageInType } from "src/model/enums/OpenPageInType";
import { TextInsertPosition } from "src/model/enums/TextInsertPosition";

export default function (props: {
	value: string;
	onChange: (value: OpenPageInType) => void;
}) {
	const { value } = props;
	return (
		<select
			className="dropdown"
			value={value || TextInsertPosition.END_OF_CONTENT}
			onChange={(e) => props.onChange(e.target.value as OpenPageInType)}
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
		label: localInstance.do_not_open,
		value: OpenPageInType.none,
	},
	{
		label: localInstance.open_page_in_modal,
		value: OpenPageInType.modal,
	},
	{
		label: localInstance.open_page_in_tab,
		value: OpenPageInType.tab,
	},
	{
		label: localInstance.open_page_in_current,
		value: OpenPageInType.current,
	},
	{
		label: localInstance.open_page_in_split,
		value: OpenPageInType.split,
	},
	{
		label: localInstance.open_page_in_window,
		value: OpenPageInType.window,
	},
];
