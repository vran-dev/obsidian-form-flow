import { useEffect, useState } from "react";
import { useObsidianApp } from "src/context/obsidianAppContext";
import { FormConfig } from "src/model/FormConfig";
import "./CpsFormEditView.css";
import CpsFormSetting from "./setting/CpsFormSetting";

export default function (props: {
	filePath: string;
	defaultConfig: FormConfig;
}) {
	const app = useObsidianApp();
	const { filePath, defaultConfig } = props;
	const [formConfig, setFormConfig] = useState<FormConfig>(defaultConfig);

	useEffect(() => {
		if (formConfig) {
			app.vault.writeJson(filePath, formConfig);
		}
	}, [formConfig, filePath]);

	return (
		<CpsFormSetting
			filePath={filePath}
			formConfig={formConfig}
			onChange={(config) => {
				setFormConfig(config as FormConfig);
			}}
		/>
	);
}
