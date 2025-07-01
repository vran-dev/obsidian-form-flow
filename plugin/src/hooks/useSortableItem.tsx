import {
	draggable,
	dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useState, useEffect } from "react";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import {
	attachClosestEdge,
	extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export default function (
	id: string,
	allowedEdges: Edge[] = ["top", "bottom"],
	canSort?: () => boolean,
	data?: any
) {
	const [dragging, setDragging] = useState<boolean>(false);
	const [draggedOver, setIsDraggedOver] = useState<boolean>(false);
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
	const [elRef, setElRef] = useState<HTMLElement | null>(null);
	const [dragHandleRef, setDragHandleRef] = useState<
		HTMLElement | null | undefined
	>();

	useEffect(() => {
		if (!elRef) {
			return;
		}
		return combine(
			draggable({
				element: elRef,
				dragHandle: dragHandleRef ? dragHandleRef : undefined,
				getInitialData: () => {
					return {
						type: "sortable-item",
						itemId: id,
						...data,
					};
				},
				canDrag: () => {
					if (canSort) {
						return canSort();
					}
					return true;
				},
				onDragStart: () => {
					setDragging(true);
				},
				onDrop: () => setDragging(false),
			}),
			dropTargetForElements({
				element: elRef,
				getData: ({ input }) => {
					return attachClosestEdge(
						{
							type: "sortable-item",
							itemId: id,
							...data,
						},
						{
							element: elRef,
							input,
							allowedEdges: allowedEdges,
						}
					);
				},
				onDrag({ self, source }) {
					const isSource = source.element === elRef;
					if (isSource) {
						setClosestEdge(null);
						return;
					}
					const closestEdge = extractClosestEdge(self.data);
					setClosestEdge(closestEdge);
				},
				onDragEnter: () => {
					setIsDraggedOver(true);
				},
				onDragLeave: () => {
					setClosestEdge(null);
					setIsDraggedOver(false);
				},
				onDrop: ({ source }) => {
					setClosestEdge(null);
					setIsDraggedOver(false);
				},
			})
		);
	}, [id, elRef, dragHandleRef, canSort]);

	return {
		closestEdge,
		dragging,
		draggedOver,
		setElRef,
		setDragHandleRef,
	};
}
