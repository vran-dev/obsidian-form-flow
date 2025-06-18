import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";
import { localInstance } from "src/i18n/locals";

export function FilterMenuDropdown(props: {
	onDelete: () => void;
	onDuplicate: () => void;
}) {
	const { onDelete, onDuplicate } = props;
	const items = [
		{
			icon: <Copy size={16} />,
			label: localInstance.duplicate,
			value: "duplicate",
			onSelect: onDuplicate,
		},
		{
			icon: <Trash2 size={16} />,
			label: localInstance.delete,
			value: "delete",
			onSelect: onDelete,
		},
	];

	return (
		<FilterDropdown
			label={
				<button className="form--TextButton">
					<MoreHorizontal size={16} />
				</button>
			}
			items={items}
		/>
	);
}
