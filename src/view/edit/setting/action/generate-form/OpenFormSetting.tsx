import { IFormAction } from "src/model/action/IFormAction";
import { GenerateFormAction } from "src/model/action/OpenFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormFields from "../../field/CpsFormFields";

export function GenerateFormSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;

	if (value.type !== FormActionType.GENERATE_FORM) {
		return null;
	}
	const action = value as GenerateFormAction;
	return (
		<CpsFormFields
			fields={action.fields || []}
			onSave={(fields) => {
				const newAction = {
					...action,
					fields: fields,
				};
				props.onChange(newAction);
			}}
		/>
	);
}
