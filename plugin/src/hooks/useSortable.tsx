import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	TouchSensor,
	MouseSensor,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode } from "react";

export interface SortableContextProps<T> {
	items: T[];
	getId: (item: T) => string;
	onChange?: (items: T[]) => void;
	axis?: "vertical" | "horizontal";
	children: ReactNode;
}

export function SortableProvider<T>(props: SortableContextProps<T>) {
	const { items, getId, onChange, axis = "vertical", children } = props;

	// 配置传感器，支持鼠标、触摸和键盘
	const sensors = useSensors(
		useSensor(MouseSensor, {
			// 需要移动 5px 才触发拖拽，防止误触
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(TouchSensor, {
			// 触摸设备上需要移动 5px 才触发拖拽
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = items.findIndex((item) => getId(item) === active.id);
		const newIndex = items.findIndex((item) => getId(item) === over.id);

		if (oldIndex !== -1 && newIndex !== -1) {
			const newItems = arrayMove(items, oldIndex, newIndex);
			onChange?.(newItems);
		}
	};

	const itemIds = items.map(getId);
	const strategy =
		axis === "horizontal"
			? horizontalListSortingStrategy
			: verticalListSortingStrategy;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={itemIds} strategy={strategy}>
				{children}
			</SortableContext>
		</DndContext>
	);
}

// 保持向下兼容的默认导出
export default function <T>(props: Omit<SortableContextProps<T>, "children">) {
	// 这个版本用于不需要 children 的场景
	// 实际的拖拽功能由 SortableProvider 提供
	return null;
}
