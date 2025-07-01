import { useMemo } from "react";
import { SelectOption2, Select2 } from "src/component/select2/Select";
import useFormConfig from "src/hooks/useFormConfig";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { OperatorType } from "src/model/filter/OperatorType";

export function ConditionOperator(props: {
	propertyId: string;
	operator: OperatorType;
	onChange: (operator: OperatorType) => void;
}) {
	const { propertyId, operator, onChange } = props;
	const formConfig = useFormConfig();
	const commomOperators: SelectOption2[] = [
		{
			value: OperatorType.Equals,
			label: localInstance.equal,
		},
		{
			value: OperatorType.NotEquals,
			label: localInstance.not_equal,
		},
	];

	const numberOperators: SelectOption2[] = [
		{
			value: OperatorType.GreaterThan,
			label: localInstance.greater_than,
		},
		{
			value: OperatorType.GreaterThanOrEqual,
			label: localInstance.greater_than_or_equal,
		},
		{
			value: OperatorType.LessThan,
			label: localInstance.less_than,
		},
		{
			value: OperatorType.LessThanOrEqual,
			label: localInstance.less_than_or_equal,
		},
	];

	const checkedOperators: SelectOption2[] = [
		{
			value: OperatorType.Checked,
			label: localInstance.checked,
		},
		{
			value: OperatorType.Unchecked,
			label: localInstance.unchecked,
		},
	];

	const valueOperators = [
		{
			value: OperatorType.HasValue,
			label: localInstance.has_value,
		},
		{
			value: OperatorType.NoValue,
			label: localInstance.no_value,
		},
	];

	const listOperators = [
		{
			value: OperatorType.Contains,
			label: localInstance.contains,
		},
		{
			value: OperatorType.NotContains,
			label: localInstance.not_contains,
		},
	];

	const options = useMemo(() => {
		const field = formConfig.fields.find((f) => f.id === propertyId);
		if (field?.type === FormFieldType.NUMBER) {
			return [...commomOperators, ...numberOperators, ...valueOperators];
		}
		if (
			field?.type === FormFieldType.CHECKBOX ||
			field?.type === FormFieldType.TOGGLE
		) {
			return [...commomOperators, ...checkedOperators];
		}

		const isList = [FormFieldType.SELECT, FormFieldType.RADIO].includes(
			field?.type as FormFieldType
		);
		if (isList) {
			return [...commomOperators, ...listOperators, ...valueOperators];
		}

		return [...commomOperators, ...valueOperators];
	}, [propertyId, formConfig]);

	return <Select2 value={operator} onChange={onChange} options={options} />;
}
