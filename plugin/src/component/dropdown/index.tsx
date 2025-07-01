import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import { ReactNode, useState } from "react";
import "./index.css";

export class DropdownMenuItem {
	label?: ReactNode;
	icon?: ReactNode;
	value: string;
	data?: any;
	onClick?: (e: React.MouseEvent) => void;
}

export function DropdownMenu(props: {
	menuLabel?: string;
	menuIcon: ReactNode;
	items: DropdownMenuItem[];
	onSelect: (item: DropdownMenuItem, e: React.MouseEvent) => void;
	className?: string;
	onOpnChange?: (open: boolean) => void;
}): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	// Handle container height adjustment when dropdown opens
	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (props.onOpnChange) {
			props.onOpnChange(open);
		}
	};

	return (
		<RadixDropdownMenu.Root onOpenChange={handleOpenChange} open={isOpen}>
			<RadixDropdownMenu.Trigger asChild>
				<button
					className={`form--DropdownLabel ${
						props.className || ""
					}`}
					onClick={(e) => {
						e.nativeEvent.stopImmediatePropagation();
						e.stopPropagation();
					}}
				>
					{props.menuLabel && (
						<span className="form--DropdownLabelText">
							{props.menuLabel}
						</span>
					)}
					{props.menuIcon}
				</button>
			</RadixDropdownMenu.Trigger>

			{isOpen && (
				<RadixDropdownMenu.Portal
					container={window.activeDocument.body}
				>
					<RadixDropdownMenu.Content
						className="form--DropdownMenus"
						collisionPadding={8}
					>
						{props.items.map((item, index) => (
							<RadixDropdownMenu.Item
								key={index}
								className="form--DropdownMenuItem"
								onClick={(e) => {
									e.nativeEvent.stopImmediatePropagation();
									e.stopPropagation();
									setIsOpen(false);
									if (item.onClick) {
										item.onClick(e as React.MouseEvent);
									} else {
										props.onSelect(
											item,
											e as React.MouseEvent
										);
									}
								}}
							>
								{item.icon && (
									<span className="form--DropdownMenuItemIcon">
										{item.icon}
									</span>
								)}
								{item.label}
							</RadixDropdownMenu.Item>
						))}
						<RadixDropdownMenu.Arrow className="form--DropdownMenuArrow" />
					</RadixDropdownMenu.Content>
				</RadixDropdownMenu.Portal>
			)}
		</RadixDropdownMenu.Root>
	);
}
