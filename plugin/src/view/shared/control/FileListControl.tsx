import { useObsidianApp } from "src/context/obsidianAppContext";
import { IFileListField } from "src/model/field/IFileListField";
import { IFormField } from "src/model/field/IFormField";
import { getMarkdownFileOptions } from "src/utils/vaultOptions";
import { SelectList } from "src/component/select-list/SelectList";

export function FileListControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const fileListField = field as IFileListField;
	const app = useObsidianApp();

	// 获取文件选项的函数
	const getOptions = (searchText: string) =>
		getMarkdownFileOptions(app, searchText);

	// 格式化值的函数（处理内部链接）
	const formatValue = (origin: string): string => {
		if (!fileListField.internalLink) {
			return origin;
		}

		const file = app.vault.getFileByPath(origin);
		if (!file) {
			return `[[${origin}]]`;
		}
		return app.fileManager.generateMarkdownLink(file, "");
	};

	return (
		<SelectList
			value={value}
			onValueChange={onValueChange}
			multiple={fileListField.multiple}
			autoFocus={autoFocus}
			getOptions={getOptions}
			formatValue={formatValue}
			placeholder={field.placeholder}
		/>
	);
}
