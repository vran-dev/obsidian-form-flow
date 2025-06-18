import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import "./FormTypeSelect.css";
import { useState } from "react";

export type TypeOption = {
	id: string;
	value: string;
	label: string;
	icon: React.ReactNode;
};

export function FormTypeSelect(props: {
	value: string;
	onChange: (string: string) => void;
	options: TypeOption[];
	hideLabel?: boolean;
	styles?: React.CSSProperties;
}) {
	const { value, onChange, options, hideLabel } = props;
	const [open, setOpen] = useState(false);
	const option = options.find((option) => option.value === value);
	const showLabelName = hideLabel !== true;
	return (
		<DropdownMenu.Root open={open} onOpenChange={setOpen}>
			<DropdownMenu.Trigger asChild>
				<button className={"form--FormTypeSelectButton"}>
					{option?.icon}
					{showLabelName && (
						<span className="form--FormTypeSelectButtonLabel">
							{option?.label}
						</span>
					)}
					{open ? (
						<ChevronDownIcon size={16} />
					) : (
						<ChevronRightIcon size={16} />
					)}
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				className={"form--FormTypeSelectOptions"}
			>
				{options.map((option) => {
					return (
						<DropdownMenu.Item
							key={option.id}
							className={"form--FormTypeSelectOption"}
							onSelect={() => onChange(option.value)}
							data-selected={option.value === value}
						>
							{option.icon} {option.label}
							{option.value === value && <Check size={12} />}
						</DropdownMenu.Item>
					);
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
