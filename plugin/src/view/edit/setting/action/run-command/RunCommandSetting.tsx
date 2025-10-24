import { IFormAction } from "src/model/action/IFormAction";
import { RunCommandFormAction } from "src/model/action/RunCommandFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";
import { ObsidianCommandAutocomplete } from "./ObsidianCommandAutocomplete";
import "./RunCommandSetting.css";
import { localInstance } from "src/i18n/locals";

export function RunCommandSetting(props: {
	value: IFormAction;
	onChange: (value: IFormAction) => void;
}) {
	const { value } = props;
	if (value.type !== FormActionType.RUN_COMMAND) {
		return null;
	}

	const action = value as RunCommandFormAction;
	return (
		<>
			<CpsFormItem
				label={localInstance.command}
				className="form--RunCommandSettingItem"
			>
				<ObsidianCommandAutocomplete
					commandId={action.commandId || ""}
					onChange={(path: { id: string; name: string }) => {
						const newAction: RunCommandFormAction = {
							...action,
							commandId: path.id,
							commandName: path.name,
						};
						props.onChange(newAction);
					}}
				/>
			</CpsFormItem>
		</>
	);
}
