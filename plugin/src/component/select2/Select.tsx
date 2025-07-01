import { Select } from "radix-ui";
import "./Select.css";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronsUpDownIcon,
	ChevronUpIcon,
} from "lucide-react";
import { localInstance } from "src/i18n/locals";

export type SelectOption2 = {
	label: string;
	value: string;
	icon?: React.ReactNode;
};

type Props = {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption2[];
};

export function Select2(props: Props) {
	const { value, onChange, options } = props;
	const valueLabel =
		options.find((option) => option.value === value)?.label ??
		localInstance.please_select_option;
	return (
		<Select.Root value={value} onValueChange={onChange}>
			<Select.Trigger className="form--Select2Trigger">
				<Select.Value placeholder={valueLabel}></Select.Value>
				<Select.Icon className="form--Select2TriggerIcon">
					<ChevronsUpDownIcon size={16} />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal container={window.activeWindow.activeDocument.body}>
				<Select.Content className="form--Select2Content">
					<Select.ScrollUpButton className="form--Select2ScrollButton">
						<ChevronUpIcon />
					</Select.ScrollUpButton>
					<Select.Viewport className="form--Select2Viewport">
						{options.map((option) => {
							return (
								<Select.Item
									key={option.value}
									value={option.value}
									className="form--Select2Item"
								>
									<Select.ItemText className="form--Select2ItemText">
										{option.label}
									</Select.ItemText>
									<Select.ItemIndicator className="form--Select2ItemIndicator">
										<CheckIcon size={16} />
									</Select.ItemIndicator>
								</Select.Item>
							);
						})}
					</Select.Viewport>
					<Select.ScrollDownButton className="form--Select2ScrollButton">
						<ChevronDownIcon />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
