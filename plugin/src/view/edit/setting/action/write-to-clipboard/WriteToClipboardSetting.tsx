import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { WriteToClipboardFormAction } from "src/model/action/WriteToClipboardFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import TextAreaContentSetting from "../common/TextAreaContentSetting";

export function WriteToClipboardSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.WRITE_TO_CLIPBOARD) {
		return null;
	}
	const action = value as WriteToClipboardFormAction;

	return (
		<TextAreaContentSetting
			actionId={action.id}
			content={action.content}
			onChange={(value) => {
				const newAction = { ...action, content: value };
				props.onChange(newAction);
			}}
		/>
	);
}