import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

export default function (
	id: string,
	canSort?: () => boolean,
	data?: any
) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
		activeIndex,
		index,
	} = useSortable({
		id,
		disabled: canSort ? !canSort() : false,
		data,
	});

	// 计算样式，应用拖拽变换
	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	// arrayMove(items, oldIndex, newIndex) 的落点由索引关系唯一决定：
	// 向下拖（activeIndex < index）落在目标之后，显示下边缘；向上拖落在目标之前，显示上边缘；
	// 悬停原位（over 为自身）不显示指示器。
	// 注意不能用中心点几何比较：over.rect 是原始布局位置，closestCenter 在拖拽中心
	// 越过两项目边界线时就翻转 over，比越过目标中心早半个目标高度，会导致指示器方向相反。
	let closestEdge: "top" | "bottom" | null = null;
	if (isOver && activeIndex !== null && activeIndex !== index) {
		closestEdge = activeIndex < index ? "bottom" : "top";
	}

	return {
		closestEdge,
		dragging: isDragging,
		draggedOver: isOver,
		setElRef: setNodeRef,
		setDragHandleRef: setActivatorNodeRef,
		attributes,
		listeners,
		style,
	};
}
