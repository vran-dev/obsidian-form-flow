import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

export default function (
	id: string,
	allowedEdges: string[] = ["top", "bottom"],
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

	// dnd-kit 不直接支持 closestEdge 的概念
	// 我们简化为只返回是否被 hover（isOver）
	// 如果需要更精确的边缘检测，可以在 DropIndicator 中实现
	const closestEdge = isOver ? "bottom" : null;

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
