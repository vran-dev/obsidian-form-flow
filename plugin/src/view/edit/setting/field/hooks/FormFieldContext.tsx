import { createContext, useContext } from "react";
import { IFormField } from "src/model/field/IFormField";

type FormFieldContextType = {
	field: IFormField;
	index: number;
};

export const FormFieldContext = createContext<FormFieldContextType | undefined>(
	undefined
);

export const useFormField = (): FormFieldContextType | null => {
	const context = useContext(FormFieldContext);
	if (!context) {
		return null;
	}
	return context;
};
