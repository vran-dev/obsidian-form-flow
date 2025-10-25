import * as Popover from "@radix-ui/react-popover";
import { FormActionType } from "src/model/enums/FormActionType";
import { NewActionGrid } from "./NewActionGrid";
import { useState } from "react";
import "./NewActionGridPopover.css";

type Props = {
	onSelect: (action: FormActionType) => void;
	children: React.ReactNode;
};

export function NewActionGridPopover({ children, onSelect }: Props) {
	const [open, setOpen] = useState(false);
	const handleSelect = (action: FormActionType) => {
		onSelect(action);
		setOpen(false);
	};
	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					className="popover"
					sideOffset={5}
					align="start"
				>
					<NewActionGrid onSelect={handleSelect} />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
