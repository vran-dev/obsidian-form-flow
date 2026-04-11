import { Select2 } from "src/component/select2/Select";
import { localInstance } from "src/i18n/locals";
import { PropertyUpdateOperation } from "src/model/enums/PropertyUpdateOperation";

export default function (props: {
	value: string;
	onChange: (value: PropertyUpdateOperation) => void;
}) {
	const { value, onChange } = props;
	return (
		<Select2
			value={value || PropertyUpdateOperation.SET}
			onChange={onChange}
			options={options}
		/>
	);
}

const options = [
	{
		value: PropertyUpdateOperation.SET,
		label: localInstance.property_operation_set,
	},
	{
		value: PropertyUpdateOperation.ADD,
		label: localInstance.property_operation_add,
	},
	{
		value: PropertyUpdateOperation.REMOVE,
		label: localInstance.property_operation_remove,
	},
];
