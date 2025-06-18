import {
	CheckCircle,
	AlertCircle,
	Info,
	AlertTriangle,
	Loader2,
	X,
} from "lucide-react";
import { ToastType } from "./Toast";

// 获取与 Toast 类型对应的图标
export function getToastIcon(type: ToastType) {
	switch (type) {
		case "success":
			return <CheckCircle className="form--Toast__typeIcon" />;
		case "error":
			return <AlertCircle className="form--Toast__typeIcon" />;
		case "info":
			return <Info className="form--Toast__typeIcon" />;
		case "warning":
			return <AlertTriangle className="form--Toast__typeIcon" />;
		case "loading":
			return (
				<Loader2 className="form--Toast__typeIcon form--Toast__spinner" />
			);
		default:
			return null;
	}
}

export function ToastView({
	content,
	onClose,
	type = "default",
}: {
	content: React.ReactNode;
	onClose: () => void;
	type?: ToastType;
}) {
	const icon = getToastIcon(type);

	return (
		<>
			<div className="form--Toast__content">
				{icon && (
					<div className="form--Toast__iconContainer">
						{icon}
					</div>
				)}
				<div className="form--Toast__message">{content}</div>
			</div>
			<button
				className="form--Toast__close"
				onClick={onClose}
				aria-label="Close"
			>
				<X size={16} />
			</button>
		</>
	);
}
