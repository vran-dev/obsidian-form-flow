import { useState } from "react";
import { IFormField } from "src/model/field/IFormField";
import { IOptionsField } from "src/model/field/ISelectField";
import { Strings } from "src/utils/Strings";

export function useInOptionsAdvancedEditing(field: IFormField) {
	const options = (field as IOptionsField).options || [];
	const hasValueInOptions = options.some((option) =>
		Strings.isNotEmpty(option.value)
	);
	const [inOptionsAdvancedEditing, setInOptionsAdvancedEditing] =
		useState(hasValueInOptions);
	return {
		inOptionsAdvancedEditing,
		setInOptionsAdvancedEditing,
	};
}
