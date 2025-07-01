import { useMemo } from "react";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IFileListField } from "src/model/field/IFileListField";
import { IFormField } from "src/model/field/IFormField";
import { ISelectField } from "src/model/field/ISelectField";
import { isTimeFormField } from "src/utils/isTimeFormField";
import { CpsFormFieldControl } from "src/view/shared/control/CpsFormFieldControl";
import SelectControl from "src/view/shared/control/SelectControl";
import ToggleControl from "src/view/shared/control/ToggleControl";
import CpsForm from "src/view/shared/CpsForm";
import { FormFieldTypeSelect } from "./common/FormFieldTypeSelect";
import { DateFieldDefaultValueControl } from "./default-value/DateFieldDefaultValueControl";
import CpsFormPropertyValueFieldSetting from "./property-value/CpsFormPropertyValueFieldSetting";
import CpsFormTextAreaFieldSetting from "./textarea/CpsFormTextAreaFieldSetting";
import CpsFormItem from "src/view/shared/CpsFormItem";

export function CpsFormFieldDetailEditing(props: {
	value: IFormField;
	onChange: (formField: IFormField) => void;
}) {
	const { value: field, onChange: setField } = props;
	const selectTypes = [FormFieldType.RADIO, FormFieldType.SELECT];

	const defaultValueEl = useMemo(() => {
		if (isTimeFormField(field.type)) {
			return (
				<DateFieldDefaultValueControl
					field={field}
					onChange={(newField) => {
						setField(newField);
					}}
				/>
			);
		}

		if (selectTypes.includes(field.type)) {
			return (
				<SelectControl
					field={field}
					value={field.defaultValue}
					onValueChange={(v) => {
						const newField = {
							...field,
							defaultValue: v,
						};
						setField(newField);
					}}
				/>
			);
		}

		return (
			<CpsFormFieldControl
				field={field}
				value={field.defaultValue}
				onValueChange={(v) => {
					const newField = {
						...field,
						defaultValue: v,
					};
					setField(newField);
				}}
			/>
		);
	}, [field, setField]);

	return (
		<CpsForm>
			<CpsFormItem label={localInstance.field_type}>
				<FormFieldTypeSelect
					value={field.type}
					onChange={(value) => {
						const newField = {
							...field,
							type: value,
						};
						props.onChange(newField);
					}}
				/>
			</CpsFormItem>
			<CpsFormItem label={localInstance.required}>
				<ToggleControl
					value={field.required === true}
					onValueChange={(value) => {
						setField({
							...field,
							required: value,
						});
					}}
				/>
			</CpsFormItem>

			<CpsFormItem label={localInstance.description}>
				<ToggleControl
					value={field.enableDescription === true}
					onValueChange={(value) => {
						setField({
							...field,
							enableDescription: value,
						});
					}}
				/>
			</CpsFormItem>
			<CpsFormItem label={localInstance.default_value}>
				{defaultValueEl}
			</CpsFormItem>

			<CpsFormPropertyValueFieldSetting
				field={field}
				onChange={setField}
			/>
			<CpsFormTextAreaFieldSetting field={field} onChange={setField} />

			{field.type === FormFieldType.FILE_LIST && (
				<>
					<CpsFormItem label={localInstance.to_internal_link}>
						<ToggleControl
							value={
								(field as IFileListField).internalLink === true
							}
							onValueChange={(value) => {
								const f = field as IFileListField;
								const v = {
									...f,
									internalLink: value,
								};
								setField(v);
							}}
						/>
					</CpsFormItem>
					<CpsFormItem label={localInstance.multiple}>
						<ToggleControl
							value={(field as IFileListField).multiple === true}
							onValueChange={(value) => {
								const f = field as IFileListField;
								if (
									value === false &&
									Array.isArray(f.defaultValue)
								) {
									f.defaultValue = f.defaultValue[0];
								}
								const v = {
									...f,
									multiple: value,
								};

								setField(v);
							}}
						/>
					</CpsFormItem>
				</>
			)}

			{field.type === FormFieldType.SELECT && (
				<CpsFormItem label={localInstance.multiple}>
					<ToggleControl
						value={(field as ISelectField).multiple === true}
						onValueChange={(value) => {
							const f = field as ISelectField;
							const v = {
								...f,
								multiple: value,
							};
							setField(v);
						}}
					/>
				</CpsFormItem>
			)}
			{selectTypes.includes(field.type) && (
				<>
					<CpsFormItem label={localInstance.enable_custom_value}>
						<ToggleControl
							value={
								(field as ISelectField).enableCustomValue ===
								true
							}
							onValueChange={(value) => {
								const f = field as ISelectField;
								const v = {
									...f,
									enableCustomValue: value,
								};
								setField(v);
							}}
						/>
					</CpsFormItem>
				</>
			)}
		</CpsForm>
	);
}
