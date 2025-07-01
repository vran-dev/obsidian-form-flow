import RadioSelect from "src/component/radio/RadioSelect";
import { IFormField } from "src/model/field/IFormField";
import { IRadioField } from "src/model/field/IRadioField";

export default function (props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const f = field as IRadioField;
	const options = (f.options || []).map((o) => {
		const value = f.enableCustomValue === true ? o.value : o.label;
		return {
			id: o.id,
			label: o.label,
			value: value,
		};
	});
	return (
		<RadioSelect
			name={field.label}
			value={value}
			onChange={onValueChange}
			options={options}
			autoFocus={autoFocus}
			required={field.required}
		/>
	);
}
