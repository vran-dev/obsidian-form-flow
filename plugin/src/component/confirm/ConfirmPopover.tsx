import React from "react";
import { localInstance } from "src/i18n/locals";
import { Popover, PopoverProps } from "../popover/Popover";
import './ConfirmPopover.css';

type ConfirmPopoverProps = Omit<
	PopoverProps,
	"children" | "open" | "onOpenChange"
> & {
	children: React.ReactNode;
	title?: string;
	confirmText?: string;
	cancelText?: string;
	message?: string | React.ReactNode;
	onConfirm: () => void;
	onCancel?: () => void;
	confirmButtonClassName?: string;
	cancelButtonClassName?: string;
};

export function ConfirmPopover(props: ConfirmPopoverProps) {
	const {
		children,
		title = localInstance.confirm_to_operation,
		confirmText = localInstance.confirm,
		cancelText = localInstance.cancel,
		message = localInstance.operation_can_not_be_undone,
		onConfirm,
		onCancel,
		confirmButtonClassName = "form--ConfirmButton",
		cancelButtonClassName = "form--CancelButton",
		...popoverProps
	} = props;
	const [open, setOpen] = React.useState(false);
	const handleCancel = () => {
		onCancel?.();
		setOpen(false);
	};

	const handleConfirm = () => {
		onConfirm();
	};

	return (
		<Popover
			open={open}
			onOpenChange={(open) => {
				if (!open && onCancel) {
					onCancel();
				}
				setOpen(open);
			}}
			side={"top"}
			align={"center"}
			{...popoverProps}
		>
			{children}
			<div className="form--ConfirmPopover">
				{title && (
					<div className="form--ConfirmTitle">{title}</div>
				)}
				<div className="form--ConfirmMessage">{message}</div>
				<div className="form--ConfirmActions">
					<button
						className={cancelButtonClassName}
						onClick={handleCancel}
						type="button"
					>
						{cancelText}
					</button>
					<button
						className={confirmButtonClassName}
						onClick={handleConfirm}
						type="button"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</Popover>
	);
}
