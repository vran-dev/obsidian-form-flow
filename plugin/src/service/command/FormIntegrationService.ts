import { App, TFile } from "obsidian";
import { FormService } from "../FormService";
import FormPlugin from "src/main";

export class FormIntegrationService {

    plugin: FormPlugin;

    private PREFIX = "@CFORM";

    getId(filePath: string) {
        return `${this.PREFIX}_${filePath}`;
    }

    getShortcut(filePath: string, app: App) {
        // get the shortcut for the file entrypoint
        const entrypointId = this.getId(filePath);
        const commandId = "form:" + entrypointId;
        const hotkeyMap = app.hotkeyManager.customKeys;
        if (hotkeyMap && commandId in hotkeyMap) {
            const hotkeys = hotkeyMap[commandId] || [];
            return hotkeys.map(hotkey => {
                const modifiers = hotkey.modifiers || [];
                const key = hotkey.key;
                const allKey = [...modifiers, key].join("+");
                return allKey;
            })
        }

        const command = app.commands.findCommand(commandId);
        if (command) {
            const hotkeys = command.hotkeys || [];
            return hotkeys.map(hotkey => {
                const modifiers = hotkey.modifiers || [];
                const key = hotkey.key;
                const allKey = [...modifiers, key].join("+");
                return allKey;
            })
        }
        return [];
    }

    /**
     * Register the entry point for the form file.
     * @param plugin The FormPlugin instance.
     */
    async initialize(plugin: FormPlugin) {
        this.plugin = plugin;
        const settings = plugin.settings || {}
        const app = plugin.app;
        const entrypoints = settings.formIntegrations || {};
        const keys = Object.keys(entrypoints);
        for (const key of keys) {
            const file = app.vault.getAbstractFileByPath(key);
            if (!(file instanceof TFile)) {
                plugin.removeCommand(`${this.getId(key)}`);
            } else {
                const entrypoint = entrypoints[key];
                if (entrypoint.asCommand) {
                    plugin.addCommand({
                        id: `${this.getId(file.path)}`,
                        name: `@${file.basename}`,
                        icon: "file-spreadsheet",
                        callback: () => {
                            new FormService().open(file, app);
                        }
                    })
                }
            }
        }
    }

    isEnable(filePath: string) {
        const settings = this.plugin.settings || {};
        const enable = settings.formIntegrations[filePath]?.asCommand ?? false;
        return enable;
    }

    async register(filePath: string) {
        const app = this.plugin.app;
        const file = app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const settings = this.plugin.settings || {};
        const newSettings = {
            ...settings,
            formIntegrations: {
                ...settings.formIntegrations,
                [filePath]: {
                    ...settings.formIntegrations[filePath],
                    asCommand: true,
                },
            },
        }
        this.plugin.replaceSettings(newSettings);
        await this.clearStale();


        this.plugin.addCommand({
            id: `${this.getId(filePath)}`,
            name: `@${file.basename}`,
            icon: "file-spreadsheet",
            callback: () => {
                new FormService().open(file, app);
            }
        })
    }

    async unregister(filePath: string) {
        this.plugin.removeCommand(`${this.getId(filePath)}`);
        const settings = this.plugin.settings || {};
        const entrypoints = settings.formIntegrations || {};
        delete entrypoints[filePath];
        this.plugin.replaceSettings({
            ...settings,
            formIntegrations: entrypoints
        });
        await this.clearStale();
    }

    async clearStale() {
        const settings = this.plugin.settings || {}
        const app = this.plugin.app;
        const entrypoints = settings.formIntegrations || {};
        const keys = Object.keys(entrypoints);
        for (const key of keys) {
            const file = app.vault.getAbstractFileByPath(key);
            if (!(file instanceof TFile)) {
                delete entrypoints[key];
            }
        }
        this.plugin.replaceSettings({
            ...settings,
            formIntegrations: entrypoints
        });
    }
}

export const formIntegrationService = new FormIntegrationService();