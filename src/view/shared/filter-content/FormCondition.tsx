import { Select2 } from "src/component/select2/Select";
import useFormConfig from "src/hooks/useFormConfig";
import { Filter } from "src/model/filter/Filter";
import { OperatorType } from "src/model/filter/OperatorType";
import { useFormField } from "../../edit/setting/field/hooks/FormFieldContext";
import { ConditionOperator } from "./ConditionOperator";
import { ConditionValue } from "./ConditionValue";
import "./FormCondition.css";
import { normalizeValue } from "./util/normalizeValue";

export function FormCondition(props: {
	filter: Filter;
	onChange: (filter: Filter) => void;
}) {
	const { filter, onChange } = props;
	const formConfig = useFormConfig();
	const formField = useFormField();
	const formFields = formConfig.fields
		.filter((f) => (formField ? f.id !== formField.field.id : true))
		.map((f) => {
			return {
				label: f.label,
				value: f.id,
			};
		});
	const hideValue =
		filter.operator === OperatorType.HasValue ||
		filter.operator === OperatorType.NoValue;
	return (
		<>
			<Select2
				value={filter.property || ""}
				onChange={(value) => {
					const newFilter = {
						...filter,
						property: value,
					};
					onChange(newFilter);
				}}
				options={formFields}
			/>
			<ConditionOperator
				propertyId={filter.property || ""}
				operator={filter.operator}
				onChange={(operator) => {
					const newFilter = {
						...filter,
						operator: operator,
						value: normalizeValue(operator, filter.value),
					};
					onChange(newFilter);
				}}
			/>

			{!hideValue && (
				<ConditionValue
					filter={filter}
					value={filter.value}
					onChange={(value) => {
						const newFilter = {
							...filter,
							value: value,
						};
						onChange(newFilter);
					}}
				/>
			)}
		</>
	);
}
