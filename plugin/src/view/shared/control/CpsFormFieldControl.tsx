import { PropertyValueSuggestInput } from "src/component/combobox/PropertyValueSuggestInput";
import { PasswordInput } from "src/component/password/PasswordInput";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFormField } from "src/model/field/IFormField";
import { IPropertyValueField } from "src/model/field/IPropertyValueField";
import { ISelectField } from "src/model/field/ISelectField";
import { ITextAreaField } from "src/model/field/ITextAreaField";
import { Strings } from "src/utils/Strings";
import { FileListControl } from "./FileListControl";
import { FolderPathControl } from "./FolderPathControl";
import RadioControl from "./RadioControl";
import SelectControl from "./SelectControl";
import ToggleControl from "./ToggleControl";

export function CpsFormFieldControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, autoFocus } = props;
	const actualValue = value || "";
	const onValueChange = props.onValueChange;

	if (field.type === FormFieldType.TEXTAREA) {
		const isTextArea = field as ITextAreaField;
		const rows = isTextArea.rows || 5;
		return (
			<textarea
				id={field.id}
				data-name={field.label}
				value={actualValue}
				rows={rows}
				required={field.required}
				onChange={(e) => onValueChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		);
	}
	if (field.type === FormFieldType.PASSWORD) {
		return (
			<PasswordInput
				value={actualValue}
				name={field.label}
				onChange={(e) => onValueChange(e)}
				required={field.required}
				autoFocus={autoFocus}
			/>
		);
	}
	if (field.type === FormFieldType.NUMBER) {
		return (
			<input
				id={field.id}
				data-name={field.label}
				type="number"
				step={"any"}
				value={actualValue}
				required={field.required}
				onChange={(e) => onValueChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		);
	}
	if (field.type === FormFieldType.DATE) {
		return (
			<input
				id={field.id}
				data-name={field.label}
				type="date"
				value={actualValue}
				max="9999-12-31"
				required={field.required}
				onChange={(e) => onValueChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		);
	}
	if (field.type === FormFieldType.DATETIME) {
		return (
			<input
				id={field.id}
				data-name={field.label}
				type="datetime-local"
				max="9999-12-31T23:59"
				value={actualValue}
				required={field.required}
				onChange={(e) => onValueChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		);
	}

	if (field.type === FormFieldType.TIME) {
		return (
			<input
				id={field.id}
				data-name={field.label}
				type="time"
				value={actualValue}
				required={field.required}
				onChange={(e) => onValueChange(e.target.value)}
				autoFocus={autoFocus}
			/>
		);
	}

	if (field.type === FormFieldType.SELECT) {
		return (
			<SelectControl
				field={field as ISelectField}
				value={actualValue}
				onValueChange={onValueChange}
				autoFocus={autoFocus}
			/>
		);
	}
	if (
		field.type === FormFieldType.TOGGLE ||
		field.type === FormFieldType.CHECKBOX
	) {
		return (
			<ToggleControl
				id={field.id}
				value={actualValue}
				required={field.required}
				onValueChange={onValueChange}
				autoFocus={autoFocus}
			/>
		);
	}
	if (field.type === FormFieldType.RADIO) {
		return (
			<RadioControl
				field={field}
				value={actualValue}
				onValueChange={onValueChange}
				autoFocus={autoFocus}
			/>
		);
	}

	if (field.type === FormFieldType.FILE_LIST) {
		return (
			<FileListControl
				field={field}
				value={actualValue}
				onValueChange={onValueChange}
				autoFocus={autoFocus}
			/>
		);
	}

	if (field.type === FormFieldType.FOLDER_PATH) {
		return (
			<FolderPathControl
				field={field}
				value={actualValue}
				onValueChange={onValueChange}
				autoFocus={autoFocus}
			/>
		);
	}

	if (field.type === FormFieldType.PROPERTY_VALUE_SUGGESTION) {
		const propertyValueField = field as IPropertyValueField;
		const propertyName = Strings.defaultIfBlank(
			propertyValueField.propertyName,
			field.label
		);
		return (
			<PropertyValueSuggestInput
				id={field.id}
				label={field.label}
				name={propertyName}
				value={actualValue}
				onChange={onValueChange}
			/>
		);
	}

	return (
		<input
			id={field.id}
			data-name={field.label}
			type="text"
			value={actualValue}
			required={field.required}
			onChange={(e) => onValueChange(e.target.value)}
			autoFocus={autoFocus}
		/>
	);
}
