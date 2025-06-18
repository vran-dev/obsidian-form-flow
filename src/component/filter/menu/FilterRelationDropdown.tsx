import { Select2 } from "src/component/select2/Select";
import { localInstance } from "src/i18n/locals";
import { RelationType, OperatorType } from "src/model/filter/OperatorType";

export function FilterRelationDropdown(props: {
	relation: RelationType;
	onChange: (joiner: RelationType) => void;
}) {
	const { relation, onChange } = props;
	const items = [
		{
			label: localInstance.operator_and,
			value: OperatorType.And,
			onSelect: () => onChange(OperatorType.And),
		},
		{
			label: localInstance.operator_or,
			value: OperatorType.Or,
			onSelect: () => onChange(OperatorType.Or),
		},
	];

	return (
		<Select2
			value={relation}
			onChange={(value) => {
				const newRelation = value as RelationType;
				onChange(newRelation);
			}}
			options={items}
		/>
	);
}
