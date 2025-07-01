import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { FormConfig } from "src/model/FormConfig";
import { getActionsCompatible } from "src/utils/getActionsCompatible";
import { v4 } from "uuid";
import FormVariableQuotePanel from "./common/variable-quoter/FormVariableQuotePanel";
import CpsFormAction from "./CpsFormAction";
import useSortable from "src/hooks/useSortable";

export function CpsFormActions(props: {
	config: FormConfig;
	onChange: (actions: IFormAction[]) => void;
}) {
	const { config } = props;
	const saveAction = (action: IFormAction[]) => {
		props.onChange(action);
	};

	const actions = getActionsCompatible(config);
	useSortable({
		items: actions || [],
		getId: (item) => item.id,
		onChange: (orders) => {
			props.onChange(orders);
		},
	});

	const addAction = () => {
		const newAction = {
			type: FormActionType.CREATE_FILE,
			targetFolder: "",
			fileName: "",
			id: v4(),
		};
		const newActions = [...actions, newAction];
		saveAction(newActions);
	};

	return (
		<div className="form--CpsFormActionsSetting">
			<FormVariableQuotePanel formConfig={config} />
			{actions.map((action, index) => {
				return (
					<CpsFormAction
						key={action.id}
						value={action}
						defaultOpen={actions.length === 1}
						onChange={(v) => {
							const newActions = actions.map((a, i) => {
								if (v.id === a.id) {
									return v;
								}
								return a;
							});
							saveAction(newActions);
						}}
						onDelete={(v) => {
							const newActions = actions.filter(
								(a) => a.id !== v.id
							);
							saveAction(newActions);
						}}
						onDuplicate={(v) => {
							const newAction = {
								...v,
								id: v4(),
							};
							const originIndex = actions.findIndex(
								(a) => a.id === v.id
							);
							const newActions = [
								...actions.slice(0, originIndex + 1),
								newAction,
								...actions.slice(originIndex + 1),
							];
							saveAction(newActions);
						}}
					/>
				);
			})}
			<button className="form--AddButton" onClick={addAction}>
				+ {localInstance.add_action}
			</button>
		</div>
	);
}
