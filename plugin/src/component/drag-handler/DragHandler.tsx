import { GripVertical } from "lucide-react";
import "./DragHandler.css";
import { forwardRef } from "react";

interface DragHandlerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: number;
	listeners?: any;
	attributes?: any;
}

const DragHandler = forwardRef<HTMLDivElement, DragHandlerProps>(
	function DragHandler(props, ref) {
		const { className, size, listeners, attributes, ...rest } = props;

		return (
			<div
				className={`form--DragHandler ${className || ""}`}
				ref={ref}
				{...listeners}
				{...attributes}
				{...rest}
			>
				<GripVertical size={size || 14} />
			</div>
		);
	}
);

export { DragHandler };
