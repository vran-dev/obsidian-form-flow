import { GripVertical } from "lucide-react";
import "./DragHandler.css";
import { forwardRef } from "react";

const DragHandler = forwardRef(function (
	props: { size?: number } & React.HTMLAttributes<HTMLDivElement>,
	ref: React.MutableRefObject<HTMLDivElement>
) {
	const { className, ...rest } = props;

	return (
		<div
			className={`form--DragHandler ${className || ""}`}
			ref={ref}
			{...rest}
		>
			<GripVertical size={props.size || 14} />
		</div>
	);
});

export { DragHandler };
