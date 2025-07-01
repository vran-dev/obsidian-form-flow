import { localInstance } from "src/i18n/locals";
import { IFormField } from "src/model/field/IFormField";
import "./DescriptionSetting.css";

export function DescriptionSetting(props: {
	field: IFormField;
	onChange: (field: IFormField) => void;
}) {
	const { field, onChange } = props;
	return (
		<div className="form--CpsFormFieldSettingDescription">
			<input
				type="text"
				value={field.description || ""}
				placeholder={localInstance.input_description_here}
				onChange={(e) => {
					onChange({
						...field,
						description: e.target.value,
					});
				}}
			/>
		</div>
	);
}
