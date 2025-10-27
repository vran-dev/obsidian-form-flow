import { useState } from "react";
import { Popover } from "src/component/popover/Popover";
import { FormActionType } from "src/model/enums/FormActionType";
import { NewActionGrid } from "./NewActionGrid";
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
		<Popover open={open} onOpenChange={setOpen}>
			{children}
			<NewActionGrid onSelect={handleSelect} />
		</Popover>
	);
}
