import { Popover as RadixPopover } from "radix-ui";
import { useState, useRef, useMemo, useEffect } from "react";
import "./FileListControl.css";

import { ChevronDown, XIcon } from "lucide-react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { localInstance } from "src/i18n/locals";
import { IFileListField } from "src/model/field/IFileListField";
import { IFormField } from "src/model/field/IFormField";
import { Strings } from "src/utils/Strings";

export function FileListControl(props: {
	field: IFormField;
	value: any;
	onValueChange: (value: any) => void;
	autoFocus?: boolean;
}) {
	const { value, field, onValueChange, autoFocus } = props;
	const fileListField = field as IFileListField;

	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [path, setPath] = useState("");
	const contentRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const app = useObsidianApp();

	const items = useMemo(() => {
		const files = app.vault.getMarkdownFiles();
		const options = files
			.filter((f) => {
				if (Strings.isEmpty(path)) {
					return true;
				}
				const filePath = Strings.safeToLowerCaseString(f.path);
				const searchValue = path.toLowerCase();
				return filePath.includes(searchValue);
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
	}, [path]);

	const values = useMemo(() => {
		if (Array.isArray(value)) {
			return value.map((v, i) => {
				return v.toString();
			});
		} else {
			if (!value) {
				return [];
			} else {
				return [value.toString()];
			}
		}
	}, [value]);

	const addValue = (newValue: string, sourceValue: string[]) => {
		const toInternalLink = (origin: string): string => {
			const file = app.vault.getFileByPath(origin);
			let link;
			if (!file) {
				link = `[[${origin}]]`;
			} else {
				link = app.fileManager.generateMarkdownLink(file, "");
			}
			return link;
		};

		const formatOne = (origin: string, internalLink?: boolean) => {
			if (internalLink) {
				return toInternalLink(origin);
			} else {
				return origin;
			}
		};

		if (fileListField.multiple) {
			const formated = formatOne(newValue, fileListField.internalLink);
			if (sourceValue.includes(formated)) {
				return;
			}
			const v = [...sourceValue, formated].filter((f) =>
				Strings.isNotBlank(f)
			);
			onValueChange(v);
		} else {
			const v = formatOne(newValue, fileListField.internalLink);
			onValueChange(v);
		}
		setPath("");
		setOpen(false);
	};

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
				addValue(items[activeIndex].value, values);
			} else {
				addValue(path, values);
			}
			setOpen(false);
		}
	};

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

	return (
		<RadixPopover.Root open={open} onOpenChange={setOpen}>
			<RadixPopover.Trigger asChild>
				<button
					className="form--FileListControlTrigger"
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault();
							setOpen(true);
						}
					}}
				>
					<TriggerItems value={value} onValueChange={onValueChange} />
					<ChevronDown
						size={16}
						className="form--FileListControlTriggerArrow"
					/>
				</button>
			</RadixPopover.Trigger>
			<RadixPopover.Portal
				container={window.activeWindow.activeDocument.body}
			>
				<RadixPopover.Content
					className="form--FileListControlContent"
					collisionPadding={{
						left: 16,
						right: 16,
						top: 8,
						bottom: 8,
					}}
					sideOffset={8}
					ref={contentRef}
				>
					<input
						type="text"
						className="form--FileListControlContentInput"
						value={path}
						onChange={(e) => {
							setPath(e.target.value);
						}}
						onKeyDown={handleKeyDown}
					/>
					<div
						className="form--FileListControlContentList"
						ref={listRef}
					>
						{items.map((item, index) => {
							return (
								<div
									key={item.id}
									className="form--FileListControlContentItem"
									data-highlighted={
										activeIndex === index ? "true" : "false"
									}
									data-id={item.id}
									onClick={() => {
										addValue(item.value, values);
									}}
								>
									{item.label}
								</div>
							);
						})}

						{items.length === 0 && (
							<span className="form--FileListControlContentTip">
								{localInstance.enter_to_create}:{" "}
								<span className="form--FileListControlContentTipInfo">
									{path}
								</span>
							</span>
						)}
					</div>
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	);
}

function TriggerItems(props: {
	value: any;
	onValueChange: (value: any) => void;
}) {
	const { value, onValueChange } = props;
	let arrayValue: string[];
	if (Array.isArray(value)) {
		arrayValue = value.map((v) => v?.toString());
	} else {
		arrayValue = [value?.toString()];
	}

	const removeValue = (v: string) => {
		if (arrayValue.length === 1) {
			onValueChange("");
		}
		const newValue = arrayValue.filter((item) => item !== v);
		if (newValue.length === 0) {
			onValueChange("");
		}
		onValueChange(newValue);
	};

	return (
		<div className="form--FileListControlTriggerItems">
			{arrayValue.map((v) => {
				return (
					<span
						className="form--FileListControlTriggerItem"
						key={v}
						aria-label={localInstance.remove_value}
					>
						{v}

						<span
							className="form--FileListControlTriggerItemClose"
							onClick={(e) => {
								e.stopPropagation();
								removeValue(v);
							}}
						>
							<XIcon size={10} />
						</span>
					</span>
				);
			})}
		</div>
	);
}
