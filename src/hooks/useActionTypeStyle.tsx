import { useMemo } from "react";
import { FormActionType } from "../model/enums/FormActionType";

export function useActionTypeStyle(type: FormActionType) {
	const typeStyles = useMemo(() => {
		switch (type) {
			case FormActionType.GENERATE_FORM:
				return {
					"--select-button-background-color":
						"rgba(var(--color-orange-rgb), 0.1)",
					"--select-button-text-color":
						"rgba(var(--color-orange-rgb), 1)",
				};
			case FormActionType.CREATE_FILE:
				return {
					"--select-button-background-color":
						"rgba(var(--color-green-rgb), 0.1)",
					"--select-button-text-color":
						"rgba(var(--color-green-rgb), 1)",
				};
			case FormActionType.INSERT_TEXT:
				return {
					"--select-button-background-color":
						"rgba(var(--color-blue-rgb), 0.1)",
					"--select-button-text-color":
						"rgba(var(--color-blue-rgb), 1)",
				};
			case FormActionType.RUN_SCRIPT:
				return {
					"--select-button-background-color":
						"rgba(var(--color-red-rgb), 0.1)",
					"--select-button-text-color":
						"rgba(var(--color-red-rgb), 1)",
				};
			default:
				return {
					"--select-button-background-color": "var(--color-base-20)",
					"--select-button-text-color": "var(--color-base-70)",
				};
		}
	}, [type]);
	return typeStyles;
}
