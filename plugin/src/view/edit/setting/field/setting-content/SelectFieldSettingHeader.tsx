import { ListIcon, Pencil } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import { useEffect, useState } from "react";
import { localInstance } from "src/i18n/locals";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { IOptionsField } from "src/model/field/ISelectField";
import { Strings } from "src/utils/Strings";

const isEmptyOptions = (field: IOptionsField) => {
	return !field.options || field.options.length === 0;
};

export function SelectFieldSettingHeader(props: {
	field: IOptionsField;
	setInEditing: (editing: boolean) => void;
}) {
	const { field } = props;
	const isSelectField =
		field.type === FormFieldType.SELECT ||
		field.type === FormFieldType.RADIO;
	const defaultMode =
		isSelectField && isEmptyOptions(field as IOptionsField)
			? "editing"
			: "preview";
	const [value, setValue] = useState<"preview" | "editing">(defaultMode);

	const toggles = [
		{
			value: "preview",
			label: localInstance.preview_mode,
			icon: <ListIcon size={16} />,
		},
		{
			value: "editing",
			label: localInstance.editing_mode,
			icon: <Pencil size={16} />,
		},
	];

	useEffect(() => {
		const isEditingMode = isSelectField && value === "editing";
		props.setInEditing(isEditingMode);
	}, [value, isSelectField]);

	if (!isSelectField) {
		return null;
	}

	return (
		<ToggleGroup.Root
			className="form--CpsFormFieldSettingContentModeGroup"
			type="single"
			aria-label={localInstance.mode}
			value={value}
			onValueChange={(value) => {
				if (Strings.isNotEmpty(value)) {
					setValue(value as "preview" | "editing");
				}
			}}
		>
			{toggles.map((toggle) => (
				<ToggleGroup.Item
					className="form--CpsFormFieldSettingContentModeItem"
					value={toggle.value}
					key={toggle.value}
					aria-label={toggle.label}
				>
					{toggle.icon}
				</ToggleGroup.Item>
			))}
		</ToggleGroup.Root>
	);
}
