import { Folder, FolderPlus, Frown } from "lucide-react";
import { normalizePath, TFolder } from "obsidian";
import { useMemo, useState } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import { FormScript } from "src/service/extend/FormScript";
import locateFile from "src/utils/locateFile";
import CalloutBlock from "../callout-block/CalloutBlock";
import ExtensionFunctionItem from "./ExtensionFcuntionItem";
import ExtensionFunctionDetail from "./ExtensionFunctionDetail";
import "./ExtensionTagSelector.css";
import { formScriptService } from "src/service/extend/FormScriptService";

export default function ExtensionFunctionBody(props: {
	extensions: FormScript[];
	activeExtension: FormScript | null;
	setActiveExtension: (extension: FormScript) => void;
	onSelectExtension: (extension: FormScript) => void;
}) {
	const {
		extensions,
		activeExtension,
		setActiveExtension,
		onSelectExtension,
	} = props;
	const app = useObsidianApp();
	const [selectedTag, setSelectedTag] = useState<string>("all");
	const scriptFolder = formScriptService.getExtensionFolder();
	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		extensions.forEach((extension) => {
			if (extension.tags && Array.isArray(extension.tags)) {
				extension.tags.forEach((tag) => tagSet.add(tag));
			}
		});
		return ["all", ...Array.from(tagSet)];
	}, [extensions]);

	const filteredExtensions = useMemo(() => {
		if (selectedTag === "all") {
			return extensions;
		}
		return extensions.filter(
			(extension) =>
				extension.tags &&
				Array.isArray(extension.tags) &&
				extension.tags.includes(selectedTag)
		);
	}, [extensions, selectedTag]);

	const isFolderExists = useMemo(() => {
		if (!scriptFolder) return false;
		const normalized = normalizePath(scriptFolder);
		const folder = app.vault.getAbstractFileByPath(normalized);
		return folder !== null && folder instanceof TFolder;
	}, [scriptFolder]);

	const handleLocateOrCreateFolder = async () => {
		if (!scriptFolder) return;

		const folderExists = app.vault.getAbstractFileByPath(scriptFolder);

		if (folderExists) {
			locateFile(scriptFolder, app);
		} else {
			try {
				await app.vault.createFolder(scriptFolder);
				locateFile(scriptFolder, app);
			} catch (error) {
				console.error("创建文件夹失败:", error);
			}
		}
	};

	if (extensions.length === 0) {
		return (
			<div className="form--ExtensionEditorEmptyState">
				<CalloutBlock icon={<Frown size={16} />} type="warning">
					<span>
						{localInstance.no_script_find_in_folder.format(
							scriptFolder || "/"
						)}
					</span>
					<div className="form--ExtensionEditorEmptyAction">
						<button onClick={handleLocateOrCreateFolder}>
							{isFolderExists ? (
								<Folder size={16} />
							) : (
								<FolderPlus size={16} />
							)}
							{localInstance.open_folder}
						</button>
					</div>
				</CalloutBlock>
			</div>
		);
	}

	return (
		<div className="form--ExtensionEditorBody">
			{/* 添加标签选择器 */}
			<div className="form--ExtensionTagSelector">
				{allTags.map((tag) => (
					<div
						key={tag}
						className={`form--ExtensionTag ${
							selectedTag === tag ? "active" : ""
						}`}
						onClick={() => setSelectedTag(tag)}
					>
						{tag === "all" ? localInstance.all : tag}
						<span className="form--ExtensionTagCount">
							{tag === "all"
								? extensions.length
								: extensions.filter((ext) =>
										ext.tags?.includes(tag)
								  ).length}
						</span>
					</div>
				))}
			</div>

			{/* 添加新的容器包裹函数列表和详情 */}
			<div className="form--ExtensionEditorContent">
				<div className="form--ExtensionEditorFunctionList">
					{filteredExtensions.map((extension) => (
						<ExtensionFunctionItem
							key={extension.id}
							extension={extension}
							isActive={extension.id === activeExtension?.id}
							onMouseEnter={() => setActiveExtension(extension)}
							onClick={() => onSelectExtension(extension)}
						/>
					))}
				</div>

				{activeExtension && (
					<ExtensionFunctionDetail extension={activeExtension} />
				)}
			</div>
		</div>
	);
}
