import { Trash2, Undo } from "lucide-react";
import { useState } from "react";
import { localInstance } from "src/i18n/locals";
import { Filter } from "src/model/filter/Filter";
import { RelationType } from "src/model/filter/OperatorType";
import { v4 } from "uuid";
import { FilterItem } from "./FilterItem";
import "./FilterRoot.css";
import {
	FilterContentComponent,
	FilterContentComponentContext,
} from "./hooks/FilterContentComponentContext";
import { FilterAddDropdown } from "./menu/FilterAddDropdown";

export interface FilterComponentProps {
	filter: Filter;
	onFilterChange: (filter: Filter) => void;
	filterContentComponent: FilterContentComponent;
}

export function FilterRoot(props: FilterComponentProps) {
	const { filter, onFilterChange, filterContentComponent } = props;
	const [undo, setUndo] = useState<Filter | null>(null);

	const removeChild = (id: string) => {
		const newConditions = filter.conditions.filter((c: Filter) => c.id !== id);
		onFilterChange({ ...filter, conditions: newConditions });
	};

	const duplicateChild = (id: string) => {
		const condition = filter.conditions.find((c: Filter) => c.id === id);
		if (condition) {
			const newCondition = { ...condition, id: v4() };
			const newConditions = [...filter.conditions, newCondition];
			onFilterChange({ ...filter, conditions: newConditions });
		}
	};

	const saveChild = (child: Filter) => {
		const newConditions = filter.conditions.map((c: Filter) => {
			if (c.id === child.id) {
				return child;
			}
			return c;
		});
		onFilterChange({
			...filter,
			conditions: newConditions,
		});
	};

	const onRelationChange = (relation: RelationType) => {
		onFilterChange({
			...filter,
			operator: relation,
		});
	};

	return (
		<FilterContentComponentContext.Provider value={filterContentComponent}>
			<div className="form--FilterRoot">
				<div className="form--FilterRootContent">
					{filter.conditions.map((condition: Filter, index: number) => {
						return (
							<FilterItem
								key={condition.id}
								filter={condition}
								index={index}
								onFilterDuplicate={duplicateChild}
								onFilterRemove={removeChild}
								onFilterChange={saveChild}
								relation={filter.operator as RelationType}
								onRelationChange={onRelationChange}
							/>
						);
					})}
					<div className="form--FilterRootAdd">
						<FilterAddDropdown
							filter={filter}
							onChange={onFilterChange}
						/>
					</div>
				</div>
				<div className="form--FilterRootFooter">
					<button
						className="form--ClearFilterButton"
						data-type="danger"
						style={{
							width: "100%",
							gap: "0.5rem",
							justifyContent: "flex-start",
							fontSize: "var(--font-ui-small)",
						}}
						onClick={(e) => {
							e.preventDefault();
							if (
								filter.conditions &&
								filter.conditions.length > 0
							) {
								setUndo(filter);
							}
							onFilterChange({
								...filter,
								conditions: [],
							});
						}}
					>
						<Trash2 size={14} /> {localInstance.clear_condition}
					</button>
					{undo && (
						<button
							className="form--UndoClearFilterButton"
							data-type="primary"
							onClick={(e) => {
								e.preventDefault();
								onFilterChange(undo);
								setUndo(null);
							}}
						>
							<Undo size={14} />
							{localInstance.undo}
						</button>
					)}
				</div>
			</div>
		</FilterContentComponentContext.Provider>
	);
}
