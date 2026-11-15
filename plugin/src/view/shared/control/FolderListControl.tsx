import { useObsidianApp } from "src/context/obsidianAppContext";
import { IFormField } from "src/model/field/IFormField";
import { getFolderOptions } from "src/utils/vaultOptions";
import { SelectList } from "src/component/select-list/SelectList";

export function FolderListControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const app = useObsidianApp();

	// 获取文件夹选项的函数
	const getOptions = (searchText: string) => getFolderOptions(app, searchText);

	return (
		<SelectList
			value={value}
			onValueChange={onValueChange}
			autoFocus={autoFocus}
			getOptions={getOptions}
			placeholder={field.placeholder}
		/>
	);
}
