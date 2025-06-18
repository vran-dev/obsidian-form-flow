import { Popover as RadixPopover } from "radix-ui";
import "./FilePathFormItem.css";
import { FileEdit } from "lucide-react";
import { TFile, Notice } from "obsidian";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import { openFilePathDirectly } from "src/utils/openFilePathDirectly";
import { Strings } from "src/utils/Strings";
import CpsFormItem from "src/view/shared/CpsFormItem";

export function FilePathFormItem(props: {
	label: string;
	value: string;
	placeholder?: string;
	onChange: (value: string) => void;
}) {
	const { value, onChange } = props;

	const app = useObsidianApp();
	const exists = useMemo(() => {
		if (Strings.isBlank(value)) {
			return false;
		}
		const file = app.vault.getAbstractFileByPath(value);
		if (file instanceof TFile) {
			return true;
		}
		return false;
	}, [value]);

	const openFile = useCallback((filePath: string) => {
		if (!filePath) {
			new Notice(localInstance.file_not_found);
			return;
		}
		const file = app.vault.getAbstractFileByPath(filePath);
		if (!file) {
			new Notice(localInstance.file_not_found + ": " + filePath);
			return;
		}
		openFilePathDirectly(app, filePath, "modal");
	}, []);

	return (
		<CpsFormItem label={props.label}>
			<MarkdownFileList
				value={value}
				onChange={(value) => {
					onChange(value);
				}}
			/>
			{exists && (
				<button
					onClick={() => {
						openFile(value);
					}}
				>
					<FileEdit size={16} />
				</button>
			)}
		</CpsFormItem>
	);
}

function MarkdownFileList(props: {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}) {
	const { value, onChange } = props;
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const contentRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const app = useObsidianApp();
	const items = useMemo(() => {
		const files = app.vault.getMarkdownFiles();
		const options = files
			.filter((f) => {
				if (value === "") {
					return true;
				}
				const path = Strings.safeToLowerCaseString(f.path);
				const searchValue = Strings.safeToLowerCaseString(value);
				return path.includes(searchValue);
			})
			.slice(0, 100)
			.map((f) => {
				return {
					id: f.path,
					value: f.path,
					label: f.path,
				};
			});
		return options;
	}, [value]);

	// 滚动到活跃项
	useEffect(() => {
		if (activeIndex >= 0 && activeIndex < items.length && listRef.current) {
			const activeItemId = items[activeIndex].id;
			const activeItem = listRef.current.querySelector(
				`[data-id="${activeItemId}"]`
			);

			if (activeItem) {
				activeItem.scrollIntoView({
					block: "nearest",
					inline: "nearest",
				});
			}
		}
	}, [activeIndex, items]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		// is composing
		if (event.nativeEvent.isComposing) {
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex((prevIndex) =>
				prevIndex < items.length - 1 ? prevIndex + 1 : 0
			);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : items.length - 1
			);
		} else if (event.key === "Enter") {
			event.preventDefault();
			if (activeIndex >= 0 && activeIndex < items.length) {
				onChange(items[activeIndex].value);
			}
			setOpen(false);
		}
	};

	return (
		<RadixPopover.Root open={open} onOpenChange={setOpen}>
			<RadixPopover.Trigger asChild>
				<span className="form--FormFilePathSuggestTrigger">
					{value}
				</span>
			</RadixPopover.Trigger>
			<RadixPopover.Portal
				container={window.activeWindow.activeDocument.body}
			>
				<RadixPopover.Content
					className="form--FormFilePathSuggestContent"
					sideOffset={4}
					collisionPadding={{
						left: 16,
						right: 16,
						top: 8,
						bottom: 8,
					}}
					ref={contentRef}
				>
					<input
						type="text"
						className="form--FormFilePathSuggestInput"
						value={value}
						onChange={(e) => {
							const newValue = e.target.value;
							onChange(newValue);
						}}
						placeholder={props.placeholder}
						onKeyDown={handleKeyDown}
					/>
					<div
						className="form--FormFilePathSuggestList"
						ref={listRef}
					>
						{items.map((item, index) => {
							return (
								<div
									key={item.id}
									className="form--FormFilePathSuggestItem"
									data-highlighted={
										activeIndex === index ? "true" : "false"
									}
									data-id={item.id}
									onClick={() => {
										onChange(item.value);
										setOpen(false);
									}}
								>
									{item.label}
								</div>
							);
						})}
					</div>
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	);
}
