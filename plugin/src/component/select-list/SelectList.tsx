import { Popover as RadixPopover } from "radix-ui";
import { useState, useRef, useEffect, useMemo } from "react";
import "./SelectList.css";
import { ChevronDown, XIcon } from "lucide-react";
import { localInstance } from "src/i18n/locals";
import { Strings } from "src/utils/Strings";

export type SelectOption = {
	id: string;
	value: string;
	label: string;
};

export interface SelectListProps {
	/** 当前选中的值 */
	value: any;
	/** 值变化回调 */
	onValueChange: (value: any) => void;
	/** 是否多选 */
	multiple?: boolean;
	/** 自动聚焦 */
	autoFocus?: boolean;
	/** 获取选项列表的函数 */
	getOptions: (searchText: string) => SelectOption[];
	/** 格式化值的函数（例如：转换为内部链接格式） */
	formatValue?: (value: string) => string;
	/** 占位符文本 */
	placeholder?: string;
	/** 空列表提示文本 */
	emptyText?: string;
	/** 自定义类名 */
	className?: string;
}

export function SelectList(props: SelectListProps) {
	const {
		value,
		onValueChange,
		multiple = false,
		autoFocus,
		getOptions,
		formatValue,
		placeholder,
		emptyText,
		className,
	} = props;

	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [searchText, setSearchText] = useState("");
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// 获取过滤后的选项（仅在搜索词变化时重新计算，避免每次渲染都全量扫描 vault）
	const items = useMemo(() => getOptions(searchText), [searchText]);

	// 转换为数组值
	const values = useMemo(() => {
		if (Array.isArray(value)) {
			return value
				.map((v) => v?.toString())
				.filter((v) => Strings.isNotBlank(v));
		}
		if (value && Strings.isNotBlank(value?.toString())) {
			return [value.toString()];
		}
		return [];
	}, [value]);

	const addValue = (newValue: string) => {
		const formattedValue = formatValue ? formatValue(newValue) : newValue;

		if (multiple) {
			if (values.includes(formattedValue)) {
				return;
			}
			const updatedValues = [...values, formattedValue].filter((f) =>
				Strings.isNotBlank(f)
			);
			onValueChange(updatedValues);
		} else {
			onValueChange(formattedValue);
		}
		setSearchText("");
		setOpen(false);
	};

	const removeValue = (v: string) => {
		const newValue = values.filter((item) => item !== v);
		if (newValue.length === 0) {
			// 多选字段清空后保持数组落盘形态，与旧实现一致
			onValueChange(multiple ? [] : "");
			return;
		}
		onValueChange(newValue);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		// 处理输入法组合
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
				addValue(items[activeIndex].value);
			} else if (Strings.isNotBlank(searchText)) {
				addValue(searchText);
			}
			setOpen(false);
		} else if (event.key === "Escape") {
			event.preventDefault();
			setOpen(false);
		}
	};

	// 滚动到激活项
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

	// 当打开弹窗时自动聚焦输入框
	useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus();
		}
	}, [open]);

	return (
		<RadixPopover.Root open={open} onOpenChange={setOpen}>
			<RadixPopover.Trigger asChild>
				<button
					className={`form--SelectListTrigger ${className || ""}`}
					autoFocus={autoFocus}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault();
							setOpen(true);
						}
					}}
				>
					<TriggerItems
						values={values}
						onRemove={removeValue}
						placeholder={placeholder}
					/>
					<ChevronDown
						size={16}
						className="form--SelectListTriggerArrow"
					/>
				</button>
			</RadixPopover.Trigger>
			<RadixPopover.Portal
				container={window.activeWindow.activeDocument.body}
			>
				<RadixPopover.Content
					className="form--SelectListContent"
					collisionPadding={{
						left: 16,
						right: 16,
						top: 8,
						bottom: 8,
					}}
					sideOffset={8}
				>
					<input
						ref={inputRef}
						type="text"
						className="form--SelectListContentInput"
						value={searchText}
						onChange={(e) => {
							setSearchText(e.target.value);
							setActiveIndex(0);
						}}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
					/>
					<div
						className="form--SelectListContentList"
						ref={listRef}
					>
						{items.map((item, index) => {
							return (
								<div
									key={item.id}
									className="form--SelectListContentItem"
									data-highlighted={
										activeIndex === index ? "true" : "false"
									}
									data-id={item.id}
									onClick={() => {
										addValue(item.value);
									}}
								>
									{item.label}
								</div>
							);
						})}

						{items.length === 0 && (
							<span className="form--SelectListContentTip">
								{emptyText || localInstance.enter_to_create}:{" "}
								<span className="form--SelectListContentTipInfo">
									{searchText}
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
	values: string[];
	onRemove: (value: string) => void;
	placeholder?: string;
}) {
	const { values, onRemove, placeholder } = props;

	if (values.length === 0) {
		return (
			<div className="form--SelectListTriggerPlaceholder">
				{placeholder || ""}
			</div>
		);
	}

	return (
		<div className="form--SelectListTriggerItems">
			{values.map((v) => {
				return (
					<span
						className="form--SelectListTriggerItem"
						key={v}
						aria-label={localInstance.remove_value}
					>
						{v}
						<span
							className="form--SelectListTriggerItemClose"
							onClick={(e) => {
								e.stopPropagation();
								onRemove(v);
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
