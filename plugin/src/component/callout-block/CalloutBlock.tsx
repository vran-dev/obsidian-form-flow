import React from "react";
import "./CalloutBlock.css";
import { X } from "lucide-react";

export default function (props: {
	title?: string;
	icon?: React.ReactNode;
	content?: React.ReactNode;
	children?: React.ReactNode;
	type?: string;
	closeable?: boolean;
	onClose?: () => void;
}) {
	return (
		<div
			className={`callout form--CalloutBlock form--CalloutBlock_${
				props.type || "info"
			}`}
			data-callout={props.type || "info"}
		>
			{props.closeable && (
				<button
					className="form--CalloutBlockCloseButton"
					onClick={props.onClose}
				>
					<X size={14} />
				</button>
			)}
			{(props.title || props.icon) && (
				<div className="form--CalloutTitle callout-title">
					{props.icon}
					{props.title && (
						<span className="form--CalloutTitleText">
							{props.title}
						</span>
					)}
				</div>
			)}
			{(props.content || props.children) && (
				<div className="form--CalloutContent callout-content">
					{props.content}
					{props.children}
				</div>
			)}
		</div>
	);
}
