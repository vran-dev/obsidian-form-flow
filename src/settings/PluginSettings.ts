export interface PluginSettings {

    formFolder: string;

    scriptFolder: string;

    formIntegrations: FormIntegration
}

export interface FormIntegration {
    [filePath: string]: {
        asCommand?: boolean;
    };
}


export const DEFAULT_SETTINGS: PluginSettings = {
    formFolder: "form/forms",
    scriptFolder: "form/scripts",
    formIntegrations: {},
};
