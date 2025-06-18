import * as Popover from "@radix-ui/react-popover";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	forwardRef,
	KeyboardEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import "./ComboboxSuggestion.css";
import { Strings } from "src/utils/Strings";

export type Option = {
	value: string;
	label: string;
	icon?: React.ReactNode;
	description?: string;
};

export default function ComboboxSuggestion(props: {
	id?: string;
	name?: string;
	label?: string;
	value: string;
	onChange: (value: string | null) => void;
	options: Option[];
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;
	className?: string;
}) {
	const {
		id,
		name,
		value,
		onChange,
		options,
		placeholder,
		required,
		disabled,
		autoFocus,
		className,
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState(value || "");
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxRef = useRef<HTMLDivElement>(null);
	const compositeRef = useRef<HTMLDivElement>(null);

	// A single ref to track interaction state across different events
	const interactionStateRef = useRef({
		isMouseDownOnOption: false,
		pendingBlur: false,
	});

	// Filter options based on query
	const matches = useMemo(() => {
		return options.filter((option) => {
			const normalizedQuery = Strings.safeToLowerCaseString(query);
			return (
				Strings.safeToLowerCaseString(option.label).includes(
					normalizedQuery
				) ||
				Strings.safeToLowerCaseString(option.value).includes(
					normalizedQuery
				)
			);
		});
	}, [options, query]);

	// Reset highlighted index when options change
	useEffect(() => {
		setHighlightedIndex(matches.length > 0 ? 0 : -1);
	}, [matches.length]);

	// Handle selection of an option
	const handleSelect = (optionValue: string) => {
		const option = options.find((o) => o.value === optionValue);
		if (option) {
			onChange(option.value);
			setQuery(option.label);
			inputRef.current?.focus(); // Return focus to input
			setIsOpen(false);
		}
	};

	// Handle input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setQuery(newValue);
		if (newValue === "") {
			onChange(null);
		} else {
			onChange(newValue);
		}
		setIsOpen(true);
	};

	const handleFocus = () => {
		if (disabled) return;
		if (!isOpen) {
			setIsOpen(true);
		}
	};

	// Handle click events on the input
	const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (disabled) return;
		e.stopPropagation();
		setIsOpen(true);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (disabled) return;

		// Don't close if we're interacting with a list option
		if (interactionStateRef.current.isMouseDownOnOption) {
			interactionStateRef.current.pendingBlur = true;
			return;
		}

		// Check if focus is moving within our component
		if (
			compositeRef.current?.contains(e.relatedTarget as Node) ||
			listboxRef.current?.contains(e.relatedTarget as Node)
		) {
			return;
		}

		setIsOpen(false);
	};

	// Handle keyboard navigation
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (disabled) return;
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
				} else {
					setHighlightedIndex((prev) =>
						Math.min(prev + 1, matches.length - 1)
					);
				}
				break;

			case "ArrowUp":
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
				} else {
					setHighlightedIndex((prev) => Math.max(prev - 1, 0));
				}
				break;

			case "Enter":
				e.preventDefault();
				if (isOpen && highlightedIndex >= 0) {
					handleSelect(matches[highlightedIndex].value);
				}
				break;

			case "Escape":
				e.preventDefault();
				setIsOpen(false);
				break;

			case "Tab":
				if (isOpen) {
					setIsOpen(false);
				}
				break;
		}
	};

	const isExactOneMatch = matches.length === 1 && matches[0].value === query;
	const showList = isOpen && matches.length > 0 && !isExactOneMatch;

	return (
		<div
			className={`form--Combobox ${className || ""}`}
			ref={compositeRef}
		>
			<Popover.Root modal={false} open={isOpen}>
				<Popover.Trigger asChild>
					<input
						ref={inputRef}
						type="text"
						id={id}
						name={name}
						placeholder={placeholder || ""}
						value={query}
						onChange={handleInputChange}
						onFocus={handleFocus}
						onClick={handleInputClick}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						className="form--ComboboxInput"
						disabled={disabled}
						required={required}
						autoFocus={autoFocus}
						role="combobox"
						aria-expanded={isOpen}
					/>
				</Popover.Trigger>

				{showList && (
					<Popover.Portal>
						<Popover.Content
							sideOffset={5}
							onOpenAutoFocus={(e) => {
								e.preventDefault();
							}}
							onCloseAutoFocus={(e) => {
								e.preventDefault();
							}}
							className="form--ComboboxContent"
							onPointerDownOutside={(e) => {
								if (
									e.target === inputRef.current ||
									compositeRef.current?.contains(
										e.target as Node
									)
								) {
									e.preventDefault();
								}
							}}
							onInteractOutside={(e) => {
								if (
									e.target === inputRef.current ||
									compositeRef.current?.contains(
										e.target as Node
									)
								) {
									e.preventDefault();
								}
							}}
						>
							<VirtualList
								ref={listboxRef}
								activeIndex={highlightedIndex}
								matches={matches}
								onSelect={handleSelect}
								onMouseDownCapture={() => {
									interactionStateRef.current.isMouseDownOnOption =
										true;
								}}
								onMouseUpCapture={() => {
									setTimeout(() => {
										if (
											interactionStateRef.current
												.pendingBlur
										) {
											interactionStateRef.current.pendingBlur =
												false;
										}
										interactionStateRef.current.isMouseDownOnOption =
											false;
									}, 0);
								}}
							/>
						</Popover.Content>
					</Popover.Portal>
				)}
			</Popover.Root>
		</div>
	);
}

const VirtualList = forwardRef(function VirtualList(
	props: {
		activeIndex: number;
		matches: Option[];
		onSelect: (value: string) => void;
		onMouseDownCapture?: React.MouseEventHandler;
		onMouseUpCapture?: React.MouseEventHandler;
	},
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const { matches, activeIndex, onMouseDownCapture, onMouseUpCapture } =
		props;
	const optionsRef = useRef<HTMLDivElement | null>(null);

	// Combine refs
	const setRefs = (element: HTMLDivElement | null) => {
		optionsRef.current = element;
		if (typeof ref === "function") ref(element);
		else if (ref) ref.current = element;
	};

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
			ref={setRefs}
			className="form--ComboboxOptionsList"
			role="listbox"
			aria-multiselectable="true"
			onMouseDownCapture={onMouseDownCapture}
			onMouseUpCapture={onMouseUpCapture}
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
						return (
							<div
								key={item.value}
								className={`form--ComboboxOption`}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									props.onSelect(item.value);
								}}
								role="option"
								data-active={row.index === props.activeIndex}
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
								<div className="form--ComboboxOptionLabel">
									{item.icon && (
										<span className="form--ComboboxOptionIcon">
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
				<></>
			)}
		</div>
	);
});
