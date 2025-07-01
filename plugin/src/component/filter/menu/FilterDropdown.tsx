import { useState } from "react";
import "./FilterDropdown.css";
import { DropdownMenu as RadixDropdownMenu } from "radix-ui";

export type DropdownMenuItem = {
	label: string;
	icon?: React.ReactNode;
	value: string;
	onSelect?: () => void;
};

type Props = {
	label: React.ReactNode;
	items: DropdownMenuItem[];
};

export function FilterDropdown(props: Props) {
	const [open, setOpen] = useState(false);
	const { items } = props;

	return (
		<RadixDropdownMenu.Root onOpenChange={setOpen} open={open}>
			<RadixDropdownMenu.Trigger asChild>
				{props.label}
			</RadixDropdownMenu.Trigger>
			{open && (
				<RadixDropdownMenu.Portal
					container={window.activeDocument.body}
				>
					<RadixDropdownMenu.Content
						className="form--FilterDropdownMenuContent"
						sideOffset={5}
						collisionPadding={8}
						align="start"
						side="bottom"
					>
						{items.map((item, index) => (
							<RadixDropdownMenu.Item
								key={item.value}
								className="form--FilterDropdownMenuItem"
								onClick={() => {
									if (item.onSelect) {
										item.onSelect();
									}
								}}
							>
								{item.icon && (
									<span className="form--FilterDropdownMenuItemIcon">
										{item.icon}
									</span>
								)}
								{item.label}
							</RadixDropdownMenu.Item>
						))}
						<RadixDropdownMenu.Arrow className="form--FilterDropdownMenuArrow" />
					</RadixDropdownMenu.Content>
				</RadixDropdownMenu.Portal>
			)}
		</RadixDropdownMenu.Root>
	);
}
