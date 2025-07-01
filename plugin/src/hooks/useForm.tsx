import { TFile } from "obsidian";
import { useState, useEffect } from "react";
import { FormConfig } from "../model/FormConfig";
import { useObsidianApp } from "../context/obsidianAppContext";

export function useForm(filePath: string, defaultConfig: FormConfig) {
	const [formConfig, setFormConfig] = useState<FormConfig>(defaultConfig);
	const [formFile, setFormFile] = useState<string>(filePath);
	const app = useObsidianApp();
	const parseConfig = async () => {
		const file = app.vault.getAbstractFileByPath(formFile);
		if (!file || !(file instanceof TFile)) {
			return null;
		}
		const data = await app.vault.read(file);
		if (!data) {
			return null;
		}
		try {
			const config = JSON.parse(data);
			return config;
		} catch (e) {
			return null;
		}
	};

	useEffect(() => {
		parseConfig().then((c) => {
			setFormConfig(c || defaultConfig);
		});
	}, [formFile, defaultConfig]);

	useEffect(() => {
		const eventRef = app.vault.on("modify", (file) => {
			if (formFile !== file.path) {
				return;
			}
			parseConfig().then((config) => {
				if (config) {
					setFormConfig(config);
				}
			});
		});

		// rename
		const renameRef = app.vault.on("rename", (file, oldPath) => {
			if (formFile !== oldPath) {
				return;
			}
			setFormFile(file.path);
		});

		return () => {
			app.vault.offref(renameRef);
			app.vault.offref(eventRef);
		};
	}, [formFile]);
	return {
		formConfig,
		formFile,
	};
}
