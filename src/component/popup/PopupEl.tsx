import {
	useFloating,
	inline,
	flip,
	shift,
	autoUpdate,
	useDismiss,
	useInteractions,
	ReferenceType,
	offset,
	size,
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import "./PopupEl.css";

type Props = {
	open: boolean;
	reference: ReferenceType | null;
	children: React.ReactNode;
	onClose?: () => void;
};

export default function (props: Props) {
	const [isOpen, setIsOpen] = useState(props.open);
	const { refs, floatingStyles, context } = useFloating({
		placement: "top",
		open: isOpen,
		onOpenChange: (open) => {
			setIsOpen(open);
			if (props.onClose && !open) {
				props.onClose();
			}
		},
		middleware: [
			inline(),
			flip(),
			shift({
				crossAxis: true,
				padding: {
					top: 8,
					bottom: 8,
					right: 16,
					left: 16,
				},
			}),
			,
			offset(8),
			size({
				padding: 12,
			}),
		],
		whileElementsMounted: autoUpdate,
	});
	const dismiss = useDismiss(context);
	const { getFloatingProps } = useInteractions([dismiss]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (refs.floating.current?.contains(e.target as Element | null)) {
				return;
			}

			if (window.getSelection()?.isCollapsed) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
	}, [refs]);

	useEffect(() => {
		refs.setReference(props.reference);
	}, [refs, props.reference]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			ref={refs.setFloating}
			className="form--PoupupContainer"
			style={{
				...floatingStyles,
			}}
			{...getFloatingProps()}
		>
			{props.children}
		</div>
	);
}
