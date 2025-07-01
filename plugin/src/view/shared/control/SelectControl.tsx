import { ListBox } from "src/component/list-box/ListBox";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { ISelectField } from "src/model/field/ISelectField";

export default function (props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const f = field as ISelectField;
	const userOptions = (f.options || []).map((o) => {
		const value = f.enableCustomValue === true ? o.value : o.label;
		return {
			id: o.id,
			label: o.label,
			value: value,
		};
	});
	const hasMatchValue = userOptions.some((v) => v.value === value);
	const isRadio = field.type === FormFieldType.RADIO;
	if (f.multiple && !isRadio) {
		return (
			<ListBox
				value={value}
				options={userOptions}
				onChange={(v) => {
					props.onValueChange(v);
				}}
			></ListBox>
		);
	}

	return (
		<select
			id={field.id}
			data-name={field.label}
			className="dropdown"
			value={hasMatchValue ? value ?? "" : ""}
			required={field.required}
			onChange={(e) => onValueChange(e.target.value)}
			autoFocus={autoFocus}
		>
			<option value="" disabled hidden>
				{localInstance.please_select_option}
			</option>
			{userOptions.map((option) => {
				return (
					<option
						key={option.id}
						value={option.value || option.label}
					>
						{option.label}
					</option>
				);
			})}
		</select>
	);
}
