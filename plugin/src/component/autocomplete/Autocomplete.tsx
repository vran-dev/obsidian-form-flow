import React, { startTransition, useCallback, useMemo } from "react";
import "./Autocomplete.css";
import { Popover } from "radix-ui";
import { AutocompleteContent } from "./AutocompleteContent";

type Props = {
	label?: string;
	value?: string;
	onSelect: (value: string) => void;
	getOptions: () => AutocompleteOption[];
	searchPlaceholder?: string;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	customTriggerElement?: React.ReactNode;
	customContentProps?: React.HTMLAttributes<HTMLDivElement>;
	modal?: boolean;
};

export interface AutocompleteOption {
	id: string;
	value: string;
	label: string;
	description?: string;
	icon?: React.ReactNode;
}

export function Autocomplete(props: Props) {
	const [open, setOpen] = React.useState(props.defaultOpen === true);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const { customTriggerElement, customContentProps } = props;
	const { className, ...restCustomContentProps } = customContentProps || {};

	// 延迟设置 defaultOpen
	React.useEffect(() => {
		if (props.defaultOpen) {
			startTransition(() => {
				setOpen(true);
			});
		}
	}, [props.defaultOpen]);

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (props.onOpenChange) {
				props.onOpenChange(newOpen);
			}
		},
		[props.onOpenChange]
	);

	const triggerHeight = useMemo(() => {
		if (!open || !triggerRef.current) return 40;
		return triggerRef.current.getBoundingClientRect().height;
	}, [open]);

	const handleSelect = useCallback(
		(value: string) => {
			props.onSelect(value);
			setOpen(false);
		},
		[props.onSelect]
	);

	const contentClassName = useMemo(
		() => `form--AutocompleteContentWrapper ${className || ""}`,
		[className]
	);

	return (
		<Popover.Root
			open={open}
			onOpenChange={handleOpenChange}
			modal={props.modal === true}
		>
			{customTriggerElement ? (
				<Popover.Trigger
					ref={triggerRef}
					className="form--AutocompleteTrigger"
					asChild={true}
				>
					{customTriggerElement}
				</Popover.Trigger>
			) : (
				<Popover.Trigger
					ref={triggerRef}
					className="form--AutocompleteTrigger"
					aria-label={props.label}
				>
					{props.label}
				</Popover.Trigger>
			)}
			{open && (
				<Popover.Content
					className={contentClassName}
					{...restCustomContentProps}
				>
					<AutocompleteContent
						getOptions={props.getOptions}
						value={props.value}
						onSelect={handleSelect}
						placeholder={props.searchPlaceholder}
					/>
				</Popover.Content>
			)}
		</Popover.Root>
	);
}
