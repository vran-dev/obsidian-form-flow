import { DropIndicator } from "src/component/drop-indicator/DropIndicator";
import { useCallback } from "react";
import { DragHandler } from "src/component/drag-handler/DragHandler";
import { SortableProvider } from "src/hooks/useSortable";
import useSortableItem from "src/hooks/useSortableItem";
import { localInstance } from "src/i18n/locals";
import "./InteractiveList.css";

export interface WithId {
	id: string;
}

export type InteractiveListProps<T extends WithId> = {
	title?: string;
	items: T[];
	onChange: (items: T[]) => void;
	onAdd?: () => void;
	addButtonLabel?: string;
	children: (
		item: T,
		index: number,
		removeItem: (item: T) => void
	) => React.ReactNode;
	className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange">;

export function InteractiveList<T extends WithId>({
	title,
	items,
	onChange,
	onAdd,
	addButtonLabel = "+ " + localInstance.add,
	children,
	className,
	...rest
}: InteractiveListProps<T>): React.ReactElement {
	const removeItem = useCallback(
		(item: T) => {
			const newItems = items.filter((i) => i.id !== item.id);
			onChange(newItems);
		},
		[items, onChange]
	);

	return (
		<div
			className={`form--InteractiveList ${className || ""}`}
			{...rest}
		>
			{title && (
				<div className="form--InteractiveListTitle">{title}</div>
			)}
			<SortableProvider
				items={items}
				getId={(item) => item.id}
				onChange={onChange}
			>
				<div className="form--InteractiveListItems">
					{items.map((item, index) =>
						children(item, index, removeItem)
					)}
				</div>
			</SortableProvider>
			{onAdd && (
				<button
					className="form--AddButton"
					style={{
						width: "100%",
					}}
					onClick={(e) => {
						e.stopPropagation();
						onAdd();
					}}
				>
					{addButtonLabel}
				</button>
			)}
		</div>
	);
}

export interface InteractiveListItemProps<T extends WithId> {
	item: T;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function InteractiveListItem<T extends WithId>({
	item,
	children,
	className,
	style,
	...rest
}: InteractiveListItemProps<T> &
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		"children"
	>): React.ReactElement {
	const {
		closestEdge,
		setElRef,
		setDragHandleRef,
		attributes,
		listeners,
		style: sortableStyle,
	} = useSortableItem(item.id, ["top", "bottom"], () => true);

	const combinedStyle = {
		...sortableStyle,
		...style,
	};

	return (
		<div
			ref={setElRef}
			className={`form--InteractiveListItem ${className || ""}`}
			style={combinedStyle}
			{...rest}
		>
			<div className="form--InteractiveListItemDrag">
				<DragHandler
					ref={setDragHandleRef}
					listeners={listeners}
					attributes={attributes}
				/>
			</div>
			<div className="form--InteractiveListItemContent">
				{children}
			</div>
			{closestEdge && (
				<DropIndicator
					edge={closestEdge as "top" | "bottom" | "left" | "right"}
					gap="1px"
				/>
			)}
		</div>
	);
}
