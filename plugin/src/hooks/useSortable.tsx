import { useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
	type Edge,
	extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

export interface SortableContextProps<T> {
	items: T[];
	getId: (item: T) => string;
	onChange?: (items: T[]) => void;
	onNativeChange?: (
		sourceId: string,
		targetId: string,
		closestEdgeOfTarget: Edge | null
	) => void;
	axis?: "vertical" | "horizontal";
}

export default function <T>(props: SortableContextProps<T>) {
	const onSort = (
		items: T[],
		sourceId: string,
		targetId: string,
		closestEdgeOfTarget: Edge | null
	) => {
		const getId = props.getId;
		const startIndex = items.findIndex((i) => getId(i) == sourceId);
		const indexOfTarget = items.findIndex((i) => getId(i) == targetId);
		const finishIndex = getReorderDestinationIndex({
			startIndex,
			closestEdgeOfTarget,
			indexOfTarget,
			axis: props.axis || "vertical",
		});
		if (finishIndex == undefined || startIndex == finishIndex) {
			return;
		}
		const newItems = reorder({
			list: items,
			startIndex: startIndex,
			finishIndex: finishIndex,
		});
		props.onChange?.(newItems);
	};

	useEffect(() => {
		return monitorForElements({
			canMonitor: (args) => {
				const source = args.source;
				const itemId = source.data.itemId as string;
				return props.items.some((item) => props.getId(item) === itemId);
			},
			onDrop: (args) => {
				const { location, source } = args;
				if (!location.current.dropTargets.length) {
					return;
				}

				if (source.data.type == "sortable-item") {
					const target = location.current.dropTargets.find(
						(t) => t.data.type == "sortable-item"
					);
					if (!target) {
						return;
					}
					const closestEdgeOfTarget = extractClosestEdge(target.data);
					if (props.onNativeChange) {
						props.onNativeChange(
							source.data.itemId as string,
							target.data.itemId as string,
							closestEdgeOfTarget
						);
					} else {
						onSort(
							props.items,
							source.data.itemId as string,
							target.data.itemId as string,
							closestEdgeOfTarget
						);
					}
				}
			},
		});
	}, [props.items, props.onChange]);
}
