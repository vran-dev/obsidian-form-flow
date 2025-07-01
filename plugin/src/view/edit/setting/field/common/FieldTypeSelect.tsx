import {
	Calendar,
	CalendarClock,
	CircleDot,
	Clock,
	File,
	FileCode,
	Hash,
	Key,
	LetterText,
	List,
	Text,
	ToggleLeft,
} from "lucide-react";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";

export default function (props: {
	value: string;
	onChange: (value: FormFieldType) => void;
}) {
	const { value } = props;
	return (
		<select
			className="dropdown"
			value={value}
			onChange={(e) => props.onChange(e.target.value as FormFieldType)}
		>
			{fieldTypeOptions.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

export const fieldTypeOptions = [
	{
		icon: <Text size={14} />,
		value: FormFieldType.TEXT,
		label: localInstance.type_text,
	},
	{
		icon: <LetterText size={14} />,
		value: FormFieldType.TEXTAREA,
		label: localInstance.type_multi_text,
	},
	{
		icon: <Hash size={14} />,
		value: FormFieldType.NUMBER,
		label: localInstance.type_number,
	},
	{
		icon: <CalendarClock size={14} />,
		value: FormFieldType.DATETIME,
		label: localInstance.type_datetime,
	},
	{
		icon: <Calendar size={14} />,
		value: FormFieldType.DATE,
		label: localInstance.type_date,
	},
	{
		icon: <Clock size={14} />,
		value: FormFieldType.TIME,
		label: localInstance.type_time,
	},
	{
		icon: <ToggleLeft size={14} />,
		value: FormFieldType.TOGGLE,
		label: localInstance.type_toggle,
	},
	{
		icon: <List size={14} />,
		value: FormFieldType.SELECT,
		label: localInstance.type_select2,
	},
	{
		icon: <CircleDot size={14} />,
		value: FormFieldType.RADIO,
		label: localInstance.type_radio,
	},
	{
		icon: <Key size={14} />,
		value: FormFieldType.PASSWORD,
		label: localInstance.type_password,
	},
	{
		icon: <File size={14} />,
		value: FormFieldType.FILE_LIST,
		label: localInstance.file_path,
	},
	{
		icon: <FileCode size={14} />,
		value: FormFieldType.PROPERTY_VALUE_SUGGESTION,
		label: localInstance.property_value_suggestions,
	},
].map((opt) => {
	return {
		...opt,
		id: opt.value,
	};
});
