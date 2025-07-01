import { forwardRef, HTMLAttributes } from "react";
import "./CpsForm.css";

type Props = HTMLAttributes<HTMLDivElement> & {
	layout?: "horizontal" | "vertical";
	children?: React.ReactNode;
};
const CpsForm = forwardRef(function (props: Props, ref: any) {
	const { children, className, layout, ...rest } = props;
	return (
		<div
			className={`form--CpsForm ${className ?? ""}`}
			data-layout={props.layout ?? "horizontal"}
			ref={ref}
			{...rest}
		>
			{children}
		</div>
	);
});

export default CpsForm;
