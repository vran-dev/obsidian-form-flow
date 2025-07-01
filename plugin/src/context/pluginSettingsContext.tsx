import { createContext, useContext } from "react";
import { App } from "obsidian";
import { PluginSettings } from "src/settings/PluginSettings";

export const PluginSettingsContext = createContext<PluginSettings | undefined>(
	undefined
);

export const usePluginSettings = (): PluginSettings => {
	const context = useContext(PluginSettingsContext);
	if (!context) {
		throw new Error(
			"usePluginSettings must be used within a PluginSettingsContext"
		);
	}
	return context;
};
