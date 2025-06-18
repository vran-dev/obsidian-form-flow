import * as Popover from "@radix-ui/react-popover";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckSquare2, ChevronDown, Square, X } from "lucide-react";
import React, {
	ChangeEvent,
	KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import "./MultipleComboboxSuggestion.css";
import { Strings } from "src/utils/Strings";
import { localInstance } from "src/i18n/locals";

export type Option = {
	value: string;
	label: string;
	icon?: React.ReactNode;
	description?: string;
};

export function MultipleComboboxSuggestion(props: {
	id?: string;
	label?: string;
	value: string[] | string;
	onChange: (value: string[] | null) => void;
	options: Option[];
	placeholder?: string;
	disabled?: boolean;
}) {
	// Component state
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(-1);
	const [isComposing, setIsComposing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const values = (
		Array.isArray(props.value) ? props.value : [props.value]
	).filter((v) => Strings.isNotEmpty(v));

	const matches = useMemo(() => {
		if (query.length === 0) {
			return props.options;
		}
		const lowerQuery = query.toLowerCase();
		return props.options.filter((option) =>
			option.label.toLowerCase().includes(lowerQuery)
		);
	}, [query, props.options]);

	const onSelect = useCallback(
		(value: string) => {
			if (values.includes(value)) {
				props.onChange(values.filter((v) => v !== value));
			} else {
				props.onChange([...values, value]);
			}
			setActiveIndex(-1);
			setIsOpen(false);
		},
		[values, props.onChange]
	);

	// keyboard navigation
	const handleNavigation = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					return;
				}
				setActiveIndex((prevIndex) =>
					Math.min(prevIndex + 1, matches.length - 1)
				);
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
			} else if (event.key === "Enter") {
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
				} else if (activeIndex >= 0) {
					onSelect(matches[activeIndex].value);
				}
			} else if (event.key === "Escape") {
				event.preventDefault();
				setIsOpen(false);
			}
		},
		[matches, activeIndex, onSelect]
	);

	const handleInputKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Enter" && query.length > 0) {
				event.preventDefault();
				const newValue = query.trim();
				if (!values.includes(newValue)) {
					props.onChange([...values, newValue]);
				}
				setQuery("");
				setActiveIndex(-1);
				setIsOpen(false);
			}
		},
		[query, values, props]
	);

	useEffect(() => {
		const focusInput = () => {
			// Use a small timeout to ensure DOM is ready
			setTimeout(() => {
				inputRef.current?.focus();
			}, 30);
		};

		if (isOpen) {
			focusInput();
		}
	}, [isOpen]);

	return (
		<div
			ref={containerRef}
			className={`form--MultipleCombobox ${
				props.disabled ? "form--MultipleCombobox-disabled" : ""
			} ${isOpen ? "form--MultipleCombobox-open" : ""}`}
			role="combobox"
			onKeyDown={handleNavigation}
		>
			<Popover.Root open={isOpen} onOpenChange={setIsOpen} modal={true}>
				<Popover.Trigger asChild>
					<div
						className="form--MultipleComboboxTrigger"
						tabIndex={props.disabled ? -1 : 0}
					>
						{values.length > 0 ? (
							<div className="form--MultipleComboboxChips">
								<ChipItems
									values={values}
									options={props.options}
									onRemove={(value) => {
										props.onChange(
											values.filter((v) => v !== value)
										);
									}}
								/>
							</div>
						) : (
							<span className="form--MultipleComboboxPlaceholder">
								{props.placeholder ||
									localInstance.click_to_typing}
							</span>
						)}
						<ChevronDown
							size={16}
							className={`form--MultipleComboboxChevron ${
								isOpen
									? "form--MultipleComboboxChevron-open"
									: ""
							}`}
						/>
					</div>
				</Popover.Trigger>

				{isOpen && (
					<Popover.Portal container={containerRef.current?.doc.body}>
						<Popover.Content
							className="form--MultipleComboboxContent"
							align="start"
							sideOffset={5}
							avoidCollisions={true}
							onOpenAutoFocus={(e) => {
								// Prevent default autofocus behavior to handle it manually
								e.preventDefault();
							}}
							onEscapeKeyDown={(e) => {
								// Prevent Escape from closing the Dialog when inside Dialog2
								e.stopPropagation();
							}}
						>
							<div className="form--MultipleComboboxHeader">
								<div className="form--MultipleComboboxChips">
									<ChipItems
										values={values}
										options={props.options}
										onRemove={(value) => {
											props.onChange(
												values.filter(
													(v) => v !== value
												)
											);
										}}
									/>
									<input
										ref={inputRef}
										id={props.id}
										name={props.label}
										type="text"
										autoFocus={true}
										className="form--MultipleComboboxInput"
										placeholder={
											values.length > 0
												? localInstance.click_to_typing
												: props.placeholder ||
												localInstance.click_to_typing
										}
										value={query}
										onChange={(
											e: ChangeEvent<HTMLInputElement>
										) => setQuery(e.target.value)}
										onCompositionStart={() =>
											setIsComposing(true)
										}
										onCompositionEnd={() => {
											setIsComposing(false);
										}}
										onKeyDown={handleInputKeyDown}
										role="searchbox"
										aria-autocomplete="list"
									/>
								</div>
							</div>
							<VirtualList
								activeIndex={activeIndex}
								selected={values}
								matches={matches}
								query={query}
								onSelect={onSelect}
							/>
						</Popover.Content>
					</Popover.Portal>
				)}
			</Popover.Root>
		</div>
	);
}

function ChipItems(props: {
	values: string[];
	options: Option[];
	onRemove: (value: string) => void;
}) {
	const { values, options, onRemove } = props;
	return (
		<>
			{values.map((item) => {
				const option = options.find((opt) => opt.value === item);
				return (
					<span
						className="form--MultipleComboboxChip"
						key={item}
					>
						{option?.icon && (
							<span className="form--MultipleComboboxChipIcon">
								{option.icon}
							</span>
						)}
						{option?.label || item}
						<button
							className="form--MultipleComboboxChipButton"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								onRemove(item);
							}}
							aria-label={`Remove ${option?.label || item}`}
							type="button"
							tabIndex={-1}
						>
							<X size={10} />
						</button>
					</span>
				);
			})}
		</>
	);
}

function VirtualList(props: {
	query: string;
	activeIndex: number;
	selected: string[];
	matches: Option[];
	onSelect: (value: string) => void;
}) {
	const { query, matches, selected, activeIndex } = props;
	const optionsRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: matches.length,
		getScrollElement: () => optionsRef.current,
		estimateSize: () => 40,
		overscan: 5,
	});

	useEffect(() => {
		if (matches.length >= 0 && activeIndex >= 0) {
			virtualizer.scrollToIndex(activeIndex, {
				align: "auto",
			});
		}
	}, [activeIndex, matches.length]);

	return (
		<div
			ref={optionsRef}
			className="form--MultipleComboboxOptions"
			role="listbox"
			aria-multiselectable="true"
		>
			{matches.length > 0 ? (
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{virtualizer.getVirtualItems().map((row) => {
						const item = matches[row.index];
						const isSelected = selected.includes(item.value);
						const isActive = row.index === activeIndex;
						return (
							<div
								key={item.value}
								className={`form--MultipleComboboxOption`}
								data-active={isActive}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									props.onSelect(item.value);
								}}
								role="option"
								aria-selected={isSelected}
								data-value={item.value}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${row.start}px)`,
									height: `${row.size}px`,
								}}
							>
								<div className="form--MultipleComboboxOptionLabel">
									<span className="form--MultipleComboboxOptionCheckbox">
										{isSelected ? (
											<CheckSquare2 size={16} />
										) : (
											<Square size={16} />
										)}
									</span>

									{item.icon && (
										<span className="form--MultipleComboboxOptionIcon">
											{item.icon}
										</span>
									)}
									{item.label}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="form--MultipleComboboxNoResults">
					{query.length > 0 ? (
						<p>
							{localInstance.no_matches_found_for.format(query)}
							<br />
							<span className="form--MultipleComboboxCreatePrompt">
								{localInstance.enter_to_create}
							</span>
						</p>
					) : (
						<p>{localInstance.no_options}</p>
					)}
				</div>
			)}
		</div>
	);
}
