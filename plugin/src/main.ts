import { Plugin } from 'obsidian';
import { PluginSettings, DEFAULT_SETTINGS } from './settings/PluginSettings';
import { formScriptService } from './service/extend/FormScriptService';
import { formIntegrationService } from './service/command/FormIntegrationService';
import { applicationCommandService } from './service/command/ApplicationCommandService';
import { applicationFileViewService } from './service/file-view/ApplicationFileViewService';
import { PluginSettingTab } from './settings/PluginSettingTab';
import './style/base.css'
import { FormFlowApi } from './api/FormFlowApi';

export default class FormPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;

	api: FormFlowApi = new FormFlowApi(this.app);

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new PluginSettingTab(this));
		await applicationCommandService.initialize(this);
		await applicationFileViewService.initialize(this);
		await formIntegrationService.initialize(this);
		this.app.workspace.onLayoutReady(async () => {
			formIntegrationService.clearStale();
			formScriptService.initialize(this.app, this.settings.scriptFolder);
		});
	}

	onunload() {
		formScriptService.unload();
		applicationCommandService.unload(this);
		applicationFileViewService.unload(this);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async replaceSettings(value: Partial<PluginSettings>) {
		this.settings = Object.assign({}, this.settings, value);
		await this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		formScriptService.refresh(this.settings.scriptFolder)
		formIntegrationService.initialize(this);
	}
}
