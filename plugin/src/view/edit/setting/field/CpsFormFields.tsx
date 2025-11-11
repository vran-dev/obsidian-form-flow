import { useCallback } from "react";
import useSortable from "src/hooks/useSortable";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { FormField, IFormField } from "src/model/field/IFormField";
import { IOptionsField } from "src/model/field/ISelectField";
import { Filter, FilterType } from "src/model/filter/Filter";
import generateSequenceName from "src/utils/generateSequenceName";
import { Strings } from "src/utils/Strings";
import { FileAutocomplete } from "src/view/shared/autocomplete/FileAutocomplete";
import { v4 } from "uuid";
import { CpsFormFieldItemEditing } from "./CpsFormFieldItemEditing";
import "./CpsFormFields.css";
import { fieldGeneratorServiceInstance } from "src/service/field/FieldGeneratorService";
import { useObsidianApp } from "src/context/obsidianAppContext";

export default function (props: {
	fields: IFormField[];
	onSave: (fields: IFormField[], modified: IFormField[]) => void;
}) {
	const app = useObsidianApp();
	const { fields } = props;
	useSortable({
		items: fields || [],
		getId: (item) => item.id,
		onChange: (orders) => {
			props.onSave(orders, []);
		},
	});

	const onFieldSave = useCallback(
		(field: IFormField) => {
			const modified = fields.find((f) => f.id === field.id);
			let newFields;
			if (fields.find((f) => f.id === field.id)) {
				newFields = updateField(field, fields);
			} else {
				newFields = [...fields, field];
			}
			props.onSave(newFields, modified ? [modified] : []);
		},
		[fields, props.onSave]
	);

	const onFieldDeleted = useCallback(
		(field: IFormField) => {
			const newFields = fields.filter((f) => f.id !== field.id);
			props.onSave(newFields, []);
		},
		[fields, props.onSave]
	);

	const onFieldAdd = useCallback(() => {
		const names = fields.map((f) => f.label);
		const newField = {
			id: v4(),
			label: generateSequenceName(names),
			type: FormFieldType.TEXT,
		};
		const newFields = [...fields, newField];
		props.onSave(newFields, []);
	}, [fields, props.onSave]);

	const onDuplicate = useCallback(
		(field: IFormField) => {
			const newField = {
				...field,
				id: v4(),
			};
			const newFields = fields.flatMap((f) => {
				if (f.id === field.id) {
					return [newField, f];
				}
				return [f];
			});
			props.onSave(newFields, []);
		},
		[fields, props.onSave]
	);

	return (
		<div className="form--CpsFormFieldsSetting">
			{fields.map((field, index) => {
				return (
					<CpsFormFieldItemEditing
						key={field.id}
						index={index}
						field={field as FormField}
						onDelete={onFieldDeleted}
						onChange={onFieldSave}
						onDuplicate={onDuplicate}
					/>
				);
			})}
			<button className="form--AddButton" onClick={onFieldAdd}>
				+{localInstance.add_field}
			</button>
			<div className="form--GenerateFieldFromFileTips">
				<FileAutocomplete
					label={localInstance.generate_fields_from_file}
					onChange={(file) => {
						const fields =
							fieldGeneratorServiceInstance.generateFromMarkdownFrontmatter(
								app,
								file
							);
						const newFields = [...props.fields, ...fields];
						props.onSave(newFields, []);
					}}
				></FileAutocomplete>
			</div>
		</div>
	);
}

function updateField(updated: IFormField, fields: IFormField[]) {
	const original = fields.find((f) => f.id === updated.id);
	if (!original) {
		return fields;
	}
	return fields.map((field) => {
		if (field.id === updated.id) {
			return updated;
		}
		if (!field.condition) {
			return field;
		}
		const newCondition = updateCondition(
			field.condition,
			original,
			updated
		);
		return {
			...field,
			condition: newCondition,
		};
	});
}

function updateCondition(
	condition: Filter,
	original: IFormField,
	updated: IFormField
) {
	if (!condition) {
		return condition;
	}
	if (condition.type === FilterType.group) {
		const conditions = condition.conditions || [];
		const newConditions = conditions.map((c) => {
			return updateCondition(c, original, updated);
		});
		condition.conditions = newConditions;
		return condition;
	}

	if (condition.property !== updated.id) {
		return condition;
	}

	// original is select
	const isSelectField = (field: IFormField) =>
		[FormFieldType.SELECT, FormFieldType.RADIO].includes(field.type);
	if (isSelectField(original) && isSelectField(updated)) {
		const originalOptions = (original as IOptionsField).options || [];
		const updatedSelectField = (updated as IOptionsField).options || [];
		const originalOptionId = originalOptions.find(
			(o) => o.value === condition.value || o.label === condition.value
		)?.id;
		if (!originalOptionId) {
			// if original option is not found, return condition as is
			return condition;
		}

		const updatedOption = updatedSelectField.find(
			(o) => o.id === originalOptionId
		);
		if (updatedOption) {
			condition.value = Strings.defaultIfEmpty(
				updatedOption.value,
				updatedOption.label
			);
		}
	}
	return condition;
}
