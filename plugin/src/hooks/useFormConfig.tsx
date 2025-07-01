import { createContext, useContext } from "react";
import { FormConfig } from "../model/FormConfig";

export const FormConfigContext = createContext<FormConfig | null>(null);

const useFormConfig = (): FormConfig => {
	const config = useContext(FormConfigContext);
	if (!config) {
		throw new Error(
			"useFormConfig must be used within a FormConfigProvider"
		);
	}
	return config;
};

export default useFormConfig;
