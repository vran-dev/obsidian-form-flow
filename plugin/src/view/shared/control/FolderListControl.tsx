import { useMemo } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { IFormField } from "src/model/field/IFormField";
import { Strings } from "src/utils/Strings";
import {
	SelectList,
	SelectOption,
} from "src/component/select-list/SelectList";

export interface IFolderListField extends IFormField {
	multiple?: boolean;
}

export function FolderListControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const folderListField = field as IFolderListField;
	const app = useObsidianApp();

	// 获取文件夹选项的函数
	const getOptions = (searchText: string): SelectOption[] => {
		const folders = app.vault.getAllFolders();
		return folders
			.filter((f) => {
				if (Strings.isEmpty(searchText)) {
					return true;
				}
				const folderPath = Strings.safeToLowerCaseString(f.path);
				const searchValue = searchText.toLowerCase();
				return folderPath.includes(searchValue);
			})
			.slice(0, 100)
			.map((f) => ({
				id: f.path,
				value: f.path,
				label: f.path,
			}));
	};

	return (
		<SelectList
			value={value}
			onValueChange={onValueChange}
			multiple={folderListField.multiple}
			autoFocus={autoFocus}
			getOptions={getOptions}
			placeholder={field.placeholder}
		/>
	);
}
