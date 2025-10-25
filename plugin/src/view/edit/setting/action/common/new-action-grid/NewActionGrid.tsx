import { useMemo, useState } from "react";
import { localInstance } from "src/i18n/locals";
import { FormActionType } from "src/model/enums/FormActionType";
import { formActionTypeOptions } from "../ActionTypeSelect";
import "./NewActionGrid.css";

type Props = {
	onSelect: (action: FormActionType) => void;
	contentProps?: React.HTMLAttributes<HTMLDivElement>;
};

export function NewActionGrid(props: Props) {
	const [query, setQuery] = useState("");
	const { onSelect } = props;

	const filteredOptions = useMemo(() => {
		return formActionTypeOptions.filter((item) => {
			return (
				item.label.toLowerCase().includes(query.toLowerCase()) ||
				item.value.toLowerCase().includes(query.toLowerCase())
			);
		});
	}, [query]);

	const handleSelect = (item: FormActionType) => {
		setQuery("");
		onSelect(item);
	};

	const { className: contentClassName, ...contentProps } =
		props.contentProps || {};

	return (
		<div
			className={`form--NewActionGridContent ${contentClassName || ""}`}
			{...contentProps}
		>
			<div className="form--NewActionGridHeader">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="form--NewActionGridSearch"
					autoFocus={true}
					placeholder={localInstance.typing}
				/>
			</div>

			<div className="form--NewActionGridBody">
				<div className="form--NewActionGridGrid">
					{filteredOptions.map((item) => (
						<div
							key={item.value}
							className="form--NewActionGridGridItem"
							onClick={() => handleSelect(item.value)}
						>
							<div className="form--NewActionGridGridItemIcon">
								{item.icon}
							</div>
							<span className="form--NewActionGridGridItemText">
								{item.label}
							</span>
						</div>
					))}
				</div>

				{filteredOptions.length === 0 && (
					<div className="form--NewActionGridEmpty">
						<span className="form--NewActionGridEmptyText">
							{localInstance.none}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
