import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { ITextAreaField } from "src/model/field/ITextAreaField";
import CpsFormItem from "src/view/shared/CpsFormItem";

export default function (props: {
	field: IFormField;
	onChange: (field: IFormField) => void;
}) {
	const { field, onChange } = props;
	if (field.type !== FormFieldType.TEXTAREA) {
		return null;
	}
	const textAreaField = field as ITextAreaField;
	return (
		<CpsFormItem label={localInstance.height}>
			<input
				type="number"
				value={textAreaField.rows}
				onChange={(e) => {
					const rows = parseInt(e.target.value);
					onChange({
						...field,
						rows: isNaN(rows) ? undefined : rows,
					} as ITextAreaField);
				}}
			/>
		</CpsFormItem>
	);
}
