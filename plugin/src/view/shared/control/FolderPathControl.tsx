import { useState, useMemo } from "react";
import { IFormField } from "src/model/field/IFormField";
import { IFolderPathField } from "src/model/field/IFolderPathField";
import FolderSuggestInput from "src/component/combobox/FolderSuggestInput";

export function FolderPathControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const folderPathField = field as IFolderPathField;
	
	const [localValue, setLocalValue] = useState(value || "");

	const handleValueChange = (newValue: string) => {
		setLocalValue(newValue);
		onValueChange(newValue);
	};

	return (
		<FolderSuggestInput
			placeholder={field.placeholder}
			value={localValue}
			onChange={handleValueChange}
		/>
	);
}