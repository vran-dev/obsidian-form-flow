import { PropertyNameSuggestInput } from "src/component/combobox/PropertyNameSuggestInput";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { IPropertyValueField } from "src/model/field/IPropertyValueField";
import CpsFormItem from "src/view/shared/CpsFormItem";

export default function (props: {
	field: IFormField;
	onChange: (field: IFormField) => void;
}) {
	const { field, onChange } = props;
	if (field.type !== FormFieldType.PROPERTY_VALUE_SUGGESTION) {
		return null;
	}
	const textAreaField = field as IPropertyValueField;
	return (
		<CpsFormItem label={localInstance.property_name}>
			<PropertyNameSuggestInput
				placeholder={field.label}
				value={textAreaField.propertyName}
				onChange={(value) => {
					const newField = {
						...textAreaField,
						propertyName: value,
					};
					onChange(newField);
				}}
			/>
		</CpsFormItem>
	);
}
