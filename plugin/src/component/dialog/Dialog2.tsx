import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import "./Dialog2.css";
import { Strings } from "src/utils/Strings";
import { localInstance } from "src/i18n/locals";

export default function (props: {
	title?: string;
	description?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dialogClassName?: string;
	modal?: boolean;
	children?: (close: () => void) => JSX.Element;
}) {
	const { title, open, onOpenChange, description } = props;
	const showTitle = Strings.isNotBlank(title);
	return (
		<DialogPrimitive.Root
			open={open}
			onOpenChange={onOpenChange}
			modal={props.modal === true}
		>
			<DialogPrimitive.Portal container={window.activeDocument.body}>
				<div className="form--DialogRoot">
					<div className="form--DialogOverlay" />
					<DialogPrimitive.Content
						className={`form--DialogContent ${
							props.dialogClassName || ""
						}`}
					>
						{showTitle ? (
							<DialogPrimitive.Title className="form--DialogTitle">
								{title}
							</DialogPrimitive.Title>
						) : (
							<VisuallyHidden asChild>
								<DialogPrimitive.Title>
									Dialog
								</DialogPrimitive.Title>
							</VisuallyHidden>
						)}
						{description ? (
							<DialogPrimitive.Description className="form--DialogDescription">
								{description}
							</DialogPrimitive.Description>
						) : (
							<VisuallyHidden asChild>
								<DialogPrimitive.Description>
									Description
								</DialogPrimitive.Description>
							</VisuallyHidden>
						)}
						{props.children && (
							<div className="form--DialogPanelChildren">
								{props.children(() => onOpenChange(false))}
							</div>
						)}
						<DialogPrimitive.Close asChild>
							<button
								className="form--DialogCloseButton"
								aria-label={localInstance.close}
								onClick={() => onOpenChange(false)}
							>
								<X size={18} />
							</button>
						</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</div>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
