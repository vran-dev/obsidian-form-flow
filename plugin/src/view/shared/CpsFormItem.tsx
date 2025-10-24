import "./CpsFormItem.css";

export default function (
	props: {
		label: React.ReactNode;
		description?: React.ReactNode;
		children: React.ReactNode;
		required?: boolean;
		layout?: "horizontal" | "vertical";
	} & React.HTMLAttributes<HTMLDivElement>
) {
	const {
		label,
		description,
		children,
		className,
		required,
		layout,
		...rest
	} = props;
	return (
		<div
			className={`form--CpsFormItem ${className || ""}`}
			data-layout={props.layout ?? "horizontal"}
			{...rest}
		>
			<div className="form--CpsFormItemInfo">
				<div
					className="form--CpsFormItemInfoName"
					data-required={props.required === true}
				>
					{props.label}
				</div>
				{props.description && (
					<div className="form--CpsFormItemInfoDescription">
						{props.description}
					</div>
				)}
			</div>
			<div className="form--CpsFormItemControl">{props.children}</div>
		</div>
	);
}
