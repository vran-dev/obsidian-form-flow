import {
	CheckSquare2,
	ChevronsUpDown,
	Square,
	SquareMinusIcon,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useCallback, useMemo } from "react";
import "./ListBox.css";
import { localInstance } from "src/i18n/locals";

type Props = {
	value: string[] | null;
	options: SelcetOption[];
	onChange: (value: string[] | null) => void;
	name?: string;
	id?: string;
	disabled?: boolean;
};

type SelcetOption = {
	id: string;
	label: string;
	value: string;
};

export function ListBox(props: Props) {
	const { value, onChange, options, name } = props;

	const values = Array.isArray(value) ? value : value ? [value] : [];
	const allSelected = values.length === options.length;
	const hasSelected = values.length > 0;
	const label = useCallback(
		(value: string) => {
			const option = options.find((option) => option.value === value);
			return option ? option.label : value;
		},
		[options]
	);

	const headerIcon = useMemo(() => {
		if (allSelected) {
			return <CheckSquare2 size={16} />;
		}
		if (hasSelected) {
			return <SquareMinusIcon size={16} />;
		}
		return <Square size={16} />;
	}, [allSelected, hasSelected]);

	return (
		<DropdownMenu.Root modal={true}>
			<DropdownMenu.Trigger asChild>
				<button className="form--ListBoxButton">
					<div className="form--ListBoxSelections">
						{values.length > 0 ? (
							<>
								{values.slice(0, 3).map((v, index) => (
									<span
										key={index}
										className="form--ListBoxTag"
									>
										{label(v)}
									</span>
								))}
								{values.length > 3 && (
									<span
										className="form--ListBoxMoreCount"
										aria-label={values
											.slice(3)
											.map((item) => item)
											.join(", ")}
									>
										+{values.length - 3}
									</span>
								)}
							</>
						) : (
							<span className="form--ListBoxPlaceholder">
								{localInstance.selected_status_text.format(
									"0",
									options.length + ""
								)}
							</span>
						)}
					</div>
					<ChevronsUpDown size={16} />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				className={"form--ListBoxOptions"}
				align="start"
			>
				<div className="form--ListBoxOptionsHeader">
					<button
						className="form--ListBoxOptionsHeaderButton"
						onClick={(e) => {
							e.preventDefault();
							if (allSelected) {
								onChange([]);
							} else {
								onChange(options.map((option) => option.value));
							}
						}}
					>
						{headerIcon}
					</button>
					<span className="form--ListBoxOptionsHeaderLabel">
						{localInstance.selected_status_text.format(
							values.length + "",
							options.length + ""
						)}
					</span>
				</div>
				{options.map((option) => {
					const isSelected = values.some(
						(currValue) => option.value === currValue
					);
					return (
						<DropdownMenu.Item
							key={option.id}
							className={"form--ListBoxOption"}
							onSelect={() => {
								if (isSelected) {
									onChange(
										values.filter(
											(currValue) =>
												currValue !== option.value
										)
									);
								} else {
									onChange([...values, option.value]);
								}
							}}
							data-selected={isSelected}
						>
							<div className={`form--ListBoxOptionContent`}>
								<span className="form--ListBoxOptionIcon">
									{isSelected ? (
										<CheckSquare2 size={16} />
									) : (
										<Square size={16} />
									)}
								</span>
								{option.label}
							</div>
						</DropdownMenu.Item>
					);
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
