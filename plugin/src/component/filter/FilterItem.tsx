import React, { useMemo } from "react";
import { v4 } from "uuid";
import "./FilterItem.css";
import { useFilterContentComponent } from "./hooks/FilterContentComponentContext";
import { FilterAddDropdown } from "./menu/FilterAddDropdown";
import { FilterMenuDropdown } from "./menu/FilterMenuDropdown";
import { FilterRelationDropdown } from "./menu/FilterRelationDropdown";
import { localInstance } from "src/i18n/locals";
import { Filter } from "src/model/filter/Filter";
import { RelationType, OperatorType } from "src/model/filter/OperatorType";

export interface FilternProps {
	index: number;
	filter: Filter;
	relation: RelationType;
	onRelationChange: (relation: RelationType) => void;
	onFilterChange: (condition: Filter) => void;
	onFilterDuplicate: (id: string) => void;
	onFilterRemove: (id: string) => void;
}

export function FilterItem(props: FilternProps) {
	const {
		filter,
		onFilterChange,
		onFilterRemove,
		onFilterDuplicate,
		relation,
		onRelationChange,
		index,
	} = props;

	const relationEl = useMemo(() => {
		if (index === 0) {
			return localInstance.operator_condition;
		}

		if (index === 1) {
			return (
				<FilterRelationDropdown
					relation={relation}
					onChange={onRelationChange}
				/>
			);
		} else {
			if (relation === OperatorType.And) {
				return localInstance.operator_and;
			} else {
				return localInstance.operator_or;
			}
		}
	}, [index, relation, onRelationChange]);

	return (
		<div className="form--Filter">
			<div className="form--FilterRelation">{relationEl}</div>
			<div className="form--FilterContent">
				{filter.type === "filter" ? (
					<FilterRule
						filter={filter}
						onChange={onFilterChange}
						onRemove={onFilterRemove}
					/>
				) : (
					<FilterGroup filter={filter} onChange={onFilterChange} />
				)}
			</div>
			<div className="form--FilterMenu">
				<FilterMenuDropdown
					onDelete={() => {
						onFilterRemove(filter.id);
					}}
					onDuplicate={() => {
						onFilterDuplicate(filter.id);
					}}
				/>
			</div>
		</div>
	);
}

export function FilterRule(props: {
	filter: Filter;
	onChange: (filter: Filter) => void;
	onRemove?: (id: string) => void;
}) {
	const { filter, onChange } = props;
	const filterContentComponent = useFilterContentComponent();
	return (
		<div className="form--FilterRule">
			{filterContentComponent &&
				React.createElement(filterContentComponent, {
					filter,
					onChange,
				})}
		</div>
	);
}

export function FilterGroup(props: {
	filter: Filter;
	onChange: (filter: Filter) => void;
}) {
	const { filter, onChange } = props;
	const onRemoveChild = (id: string) => {
		const newConditions = filter.conditions.filter((c) => c.id !== id);
		onChange({ ...filter, conditions: newConditions });
	};

	const onDuplicateChild = (id: string) => {
		const condition = filter.conditions.find((c) => c.id === id);
		if (condition) {
			const newCondition = { ...condition, id: v4() };
			const newConditions = [...filter.conditions, newCondition];
			onChange({ ...filter, conditions: newConditions });
		}
	};

	const saveChild = (condition: Filter) => {
		const newConditions = filter.conditions.map((c) => {
			if (c.id === condition.id) {
				return condition;
			}
			return c;
		});
		onChange({
			...filter,
			conditions: newConditions,
		});
	};

	const onRelationChange = (joiner: RelationType) => {
		onChange({
			...filter,
			operator: joiner,
		});
	};
	return (
		<div className="form--FilterGroup">
			{filter.conditions.map((c, index) => (
				<FilterItem
					key={c.id}
					filter={c}
					index={index}
					onFilterChange={saveChild}
					onFilterRemove={onRemoveChild}
					onFilterDuplicate={onDuplicateChild}
					relation={filter.operator as RelationType}
					onRelationChange={onRelationChange}
				/>
			))}
			<div className="form--FilterGroupAdd">
				<FilterAddDropdown filter={filter} onChange={onChange} />
			</div>
		</div>
	);
}
