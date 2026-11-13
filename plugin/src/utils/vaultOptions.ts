import { App } from "obsidian";
import { SelectOption } from "src/component/select-list/SelectList";
import { Strings } from "src/utils/Strings";

const MAX_OPTIONS = 100;

export function getMarkdownFileOptions(
	app: App,
	searchText: string
): SelectOption[] {
	return app.vault
		.getMarkdownFiles()
		.filter((file) => matchesSearchText(file.path, searchText))
		.slice(0, MAX_OPTIONS)
		.map(toPathOption);
}

export function getFolderOptions(
	app: App,
	searchText: string
): SelectOption[] {
	return app.vault
		.getAllFolders()
		.filter((folder) => matchesSearchText(folder.path, searchText))
		.slice(0, MAX_OPTIONS)
		.map(toPathOption);
}

function matchesSearchText(path: string, searchText: string): boolean {
	if (Strings.isEmpty(searchText)) {
		return true;
	}
	return Strings.safeToLowerCaseString(path).includes(
		Strings.safeToLowerCaseString(searchText)
	);
}

function toPathOption(item: { path: string }): SelectOption {
	return {
		id: item.path,
		value: item.path,
		label: item.path,
	};
}
