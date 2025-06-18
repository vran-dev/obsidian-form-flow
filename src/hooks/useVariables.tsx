import { useMemo } from "react";
import { GenerateFormAction } from "../model/action/OpenFormAction";
import { SuggestModalFormAction } from "../model/action/SuggestModalFormAction";
import { FormActionType } from "../model/enums/FormActionType";
import { FormConfig } from "../model/FormConfig";

export function useVariables(actionId: string, formConfig: FormConfig) {
	return useMemo(() => {
		const actions = formConfig.actions || [];
		const fields = (formConfig.fields || []).map((f) => {
			return {
				label: f.label,
				info: f.description,
				type: "variable",
			};
		});
		const currentIndex = actions.findIndex((a) => a.id === actionId);
		for (let i = currentIndex - 1; i >= 0; i--) {
			const action = actions[i];
			if (action.type === FormActionType.SUGGEST_MODAL) {
				const a = action as SuggestModalFormAction;
				if (fields.find((f) => f.label === a.fieldName)) {
					continue;
				}
				fields.push({
					label: a.fieldName,
					info: "",
					type: "variable",
				});
			}

			if (action.type === FormActionType.GENERATE_FORM) {
				const a = action as GenerateFormAction;
				const afields = a.fields || [];
				afields.forEach((f) => {
					if (!fields.find((ff) => ff.label === f.label)) {
						fields.push({
							label: f.label,
							info: f.description,
							type: "variable",
						});
					}
				});
			}
		}

		return fields;
	}, [formConfig]);
}
