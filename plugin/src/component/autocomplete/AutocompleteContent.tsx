import { useVirtualizer } from "@tanstack/react-virtual";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { localInstance } from "src/i18n/locals";
import { Strings } from "src/utils/Strings";
import { AutocompleteOption } from "./Autocomplete";
import { AutocompleteOptionEl } from "./AutocompleteOptionEl";
import { AutocompleteValueEl } from "./AutocompleteValueEl";

export function AutocompleteContent(props: {
	getOptions: () => AutocompleteOption[];
	value?: string;
	onSelect: (value: string) => void;
	placeholder?: string;
}) {
	const [query, setQuery] = React.useState("");
	const [activeIndex, setActiveIndex] = React.useState(-1);
	const [render, setRender] = React.useState(false);
	const { getOptions, value, onSelect } = props;
	const listRef = React.useRef<HTMLDivElement>(null);
	const allOptionsRef = React.useRef<AutocompleteOption[]>(getOptions());
	const contentRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		allOptionsRef.current = getOptions();
	}, [getOptions]);

	const options = useMemo(() => {
		const allOptions = allOptionsRef.current;
		if (Strings.isEmpty(query)) {
			return allOptions;
		}
		const lowerQuery = Strings.safeToLowerCaseString(query);
		return allOptions.filter(
			(option) =>
				Strings.safeToLowerCaseString(option.label).includes(
					lowerQuery
				) ||
				Strings.safeToLowerCaseString(option.value).includes(lowerQuery)
		);
	}, [query]);

	const virtualizer = useVirtualizer({
		count: options.length,
		getScrollElement: () => listRef.current,
		estimateSize: () => 40,
		paddingStart: 4,
		paddingEnd: 4,
		overscan: 5,
	});

	useEffect(() => {
		if (options.length >= 0 && activeIndex >= 0) {
			virtualizer.scrollToIndex(activeIndex, {
				align: "auto",
			});
		}
	}, [activeIndex, options.length]);

	const items = virtualizer.getVirtualItems();

	useEffect(() => {
		setActiveIndex(options.length > 0 ? 0 : -1);
	}, [options.length]);

	useEffect(() => {
		if (
			activeIndex >= 0 &&
			activeIndex < options.length &&
			listRef.current
		) {
			const item = options[activeIndex];
			if (item) {
				virtualizer.scrollToIndex(activeIndex);
			}
		}
	}, [activeIndex, options, virtualizer]);

	const selectedOption = useMemo(() => {
		if (value) {
			return allOptionsRef.current.find(
				(option) => option.value === value
			);
		}
		return undefined;
	}, [value]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setActiveIndex((prev) =>
					Math.min(prev + 1, options.length - 1)
				);
				break;

			case "ArrowUp":
				e.preventDefault();
				setActiveIndex((prev) => Math.max(prev - 1, 0));
				break;

			case "Enter":
				e.preventDefault();
				e.stopPropagation();
				e.nativeEvent.stopImmediatePropagation();
				if (activeIndex >= 0) {
					onSelect(options[activeIndex].value);
				} else if (Strings.isNotEmpty(query.trim())) {
					onSelect(query);
				}
				break;
		}
	};

	const hasExactMatch = useMemo(() => {
		if (!query.trim()) return false;
		return options.some(
			(option) => option.value === query || option.label === query
		);
	}, [options, query]);

	const showCreateOption = query.trim() && !hasExactMatch;

	useEffect(() => {
		if (contentRef.current) {
			setRender(true);
		}
	}, []);

	return (
		<div className="form--AutocompleteContent" ref={contentRef}>
			<div className="form--AutocompleteHeader">
				{selectedOption && (
					<AutocompleteValueEl
						option={selectedOption}
						onRemove={() => onSelect("")}
					/>
				)}
				<input
					type="text"
					value={query}
					onKeyDown={handleKeyDown}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={props.placeholder ?? localInstance.typing}
					autoFocus={true}
				/>
			</div>
			{render && (
				<div className="form--AutocompleteOptions" ref={listRef}>
					{items.length > 0 && (
						<div
							style={{
								height: `${virtualizer.getTotalSize()}px`,
								width: "100%",
								position: "relative",
							}}
						>
							<div
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${
										items[0]?.start ?? 0
									}px)`,
								}}
							>
								{items.map((row) => {
									const item = options[row.index];
									return (
										<AutocompleteOptionEl
											key={item.value}
											data-id={item.id}
											data-index={row.index}
											data-selected={value === item.value}
											data-actived={
												activeIndex === row.index
											}
											onClick={() => onSelect(item.value)}
											option={item}
											ref={(r) => {
												virtualizer.measureElement(r);
											}}
										/>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}
			{showCreateOption && (
				<NoValueMatchItem
					query={query}
					onSelect={onSelect}
					activeIndex={activeIndex}
					currentIndex={options.length}
				/>
			)}
		</div>
	);
}

function NoValueMatchItem(props: {
	query: string;
	onSelect: (value: string) => void;
	activeIndex: number;
	currentIndex: number;
}) {
	const { query, onSelect } = props;
	if (!query.trim()) {
		return null;
	}
	return (
		<div
			className={`form--AutocompleteOption form--AutocompleteNoMatch`}
			onClick={() => onSelect(query)}
			data-id="no-match-create"
		>
			<PlusIcon size={16} />
			{localInstance.create}
			<span className="form--AutocompleteNoMatchValue">{query}</span>
		</div>
	);
}
