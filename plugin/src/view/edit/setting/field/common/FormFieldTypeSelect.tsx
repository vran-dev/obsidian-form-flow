import { FormFieldType } from "src/model/enums/FormFieldType";
import { FormTypeSelect } from "src/view/shared/select/FormTypeSelect";
import { fieldTypeOptions } from "./FieldTypeSelect";
import "./FormFieldTypeSelect.css";

export function FormFieldTypeSelect(props: {
	value: FormFieldType;
	onChange: (value: FormFieldType) => void;
}) {
	const { value, onChange } = props;
	return (
		<FormTypeSelect
			value={value}
			onChange={onChange}
			options={fieldTypeOptions}
		/>
	);
}
