import "./DropIndicator.css";

interface DropIndicatorProps {
	edge: "top" | "bottom" | "left" | "right" | null;
	gap?: string;
}

export function DropIndicator({ edge, gap = "1px" }: DropIndicatorProps) {
	if (!edge) {
		return null;
	}

	const isVertical = edge === "top" || edge === "bottom";
	const className = `form--DropIndicator form--DropIndicator--${edge}`;

	return (
		<div
			className={className}
			style={{
				[isVertical ? "height" : "width"]: gap,
			}}
		/>
	);
}
