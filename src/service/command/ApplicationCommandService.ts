import { localInstance } from "src/i18n/locals";
import FormPlugin from "src/main";
import { FormService } from "../FormService";
import CFormSuggestModal from "src/component/modal/CFormSuggestModal";
import { normalizePath } from "obsidian";
import { FormConfig } from "src/model/FormConfig";
import { DEFAULT_SETTINGS } from "src/settings/PluginSettings";
import { openFilePathDirectly } from "src/utils/openFilePathDirectly";
import { Strings } from "src/utils/Strings";
import { processObTemplate } from "src/utils/templates";
import { v4 } from "uuid";
import { CreateFileModal } from "src/component/modal/CreateFileModal";
import { Files } from "src/utils/Files";

export class ApplicationCommandService {

    initialize(plugin: FormPlugin) {
        const app = plugin.app;
        plugin.addCommand({
            id: "open-form",
            name: localInstance.open_form,
            icon: "file-spreadsheet",
            callback: () => {
                const modal = new CFormSuggestModal(app,
                    (file) => {
                        new FormService().open(file, app);
                    })
                modal.open();
            }
        });

        plugin.addCommand({
            id: "create-form",
            name: localInstance.create_form,
            icon: "file-spreadsheet",
            callback: () => {
                this.createFormFile(plugin)
            },
        });
    }

    unload(plugin: FormPlugin) {
        // Unload any application commands if necessary
    }

    private createFormFile(plugin: FormPlugin) {
        const app = plugin.app;
        const settings = plugin.settings;
        const folder = Strings.defaultIfBlank(settings.formFolder, DEFAULT_SETTINGS.formFolder);
        const targetFolder = normalizePath(processObTemplate(folder));
        const modal = new CreateFileModal(app, {
            defaultFilebasename: localInstance.unnamed,
            defaultTargetFolder: targetFolder,
            fileType: "cform",
            onSubmit: async (fileName, targetFolder) => {
                const formConfig = new FormConfig(v4())
                const json = JSON.stringify(formConfig, null, 2);
                const file = await Files.createFile(app, fileName, targetFolder, json);
                await openFilePathDirectly(app, file.path, "modal");
                modal.close();
            }
        })
        modal.open();
    }
}

export const applicationCommandService = new ApplicationCommandService();