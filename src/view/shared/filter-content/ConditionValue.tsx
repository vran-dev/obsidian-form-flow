import useFormConfig from "src/hooks/useFormConfig";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { ISelectField } from "src/model/field/ISelectField";
import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { CpsFormFieldControl } from "../control/CpsFormFieldControl";
import SelectControl from "../control/SelectControl";

export function ConditionValue(props: {
	filter: Filter;
	value: any;
	onChange: (value: any) => void;
}) {
	const formConfig = useFormConfig();
	const { filter } = props;
	const propertyId = filter.property || "";
	const field = formConfig.fields.find((f) => f.id === propertyId);
	const { value, onChange } = props;
	if (!field) {
		return (
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={localInstance.value}
			/>
		);
	}
	if (
		field.type === FormFieldType.RADIO ||
		field.type === FormFieldType.SELECT
	) {
		const selectField = field as ISelectField;
		const isMultiple =
			filter.operator === OperatorType.Contains ||
			filter.operator === OperatorType.NotContains;
		const multipleSelect = {
			...selectField,
			multiple: isMultiple,
		};
		return (
			<SelectControl
				field={multipleSelect}
				value={value}
				onValueChange={onChange}
			/>
		);
	}
	return (
		<CpsFormFieldControl
			field={field}
			value={value}
			onValueChange={(v) => {
				onChange(v);
			}}
		/>
	);
}
