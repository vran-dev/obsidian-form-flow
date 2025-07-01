import { localInstance } from "src/i18n/locals";
import { IFormField } from "src/model/field/IFormField";
import {
	BaseTimeField,
	TimeFieldDefaultValueType,
} from "src/model/field/time/BaseTimeField";
import { isTimeFormField } from "src/utils/isTimeFormField";
import { CpsFormFieldControl } from "src/view/shared/control/CpsFormFieldControl";
import "./DateFieldDefaultValueControl.css";
import Toggle from "src/component/toggle/Toggle";

export function DateFieldDefaultValueControl(props: {
	field: IFormField;
	onChange: (field: BaseTimeField) => void;
}) {
	const { field, onChange } = props;
	if (!isTimeFormField(field.type)) {
		return null;
	}
	const dateField = field as BaseTimeField;
	const options = [
		{
			id: TimeFieldDefaultValueType.CURRENT,
			value: TimeFieldDefaultValueType.CURRENT,
			label: localInstance.now,
		},
		{
			id: TimeFieldDefaultValueType.CUSTOM,
			value: TimeFieldDefaultValueType.CUSTOM,
			label: localInstance.specified_date_time,
		},
	];
	return (
		<div className="form--DateFieldDefaultValueControl">
			<Toggle
				value={
					dateField.defaultValueType ||
					TimeFieldDefaultValueType.CUSTOM
				}
				options={options}
				onChange={(type) => {
					const newField = {
						...field,
						defaultValueType: type,
					} as BaseTimeField;
					onChange(newField);
				}}
			/>
			{dateField.defaultValueType ===
				TimeFieldDefaultValueType.CUSTOM && (
				<CpsFormFieldControl
					field={field}
					value={field.defaultValue}
					onValueChange={(v) => {
						const newField = {
							...field,
							defaultValue: v,
						} as BaseTimeField;
						onChange(newField);
					}}
				/>
			)}
		</div>
	);
}
