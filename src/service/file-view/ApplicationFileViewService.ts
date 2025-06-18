import FormPlugin from "src/main";
import { CFormTextFileView } from "./CFormTextFileView";
import { CFormEmbedView } from "./CFormEmbedView";

export class ApplicationFileViewService {

    initialize(plugin: FormPlugin) {
        plugin.registerView(CFormTextFileView.FORM_VIEW, (leaf) => {
            return new CFormTextFileView(leaf);
        });
        plugin.registerExtensions(["cform"], CFormTextFileView.FORM_VIEW);
        plugin.app.embedRegistry.registerExtensions(
            ["cform"],
            (info, file, subPath) =>
                new CFormEmbedView(info, file, subPath || "", plugin.app)
        );
    }


    unload(plugin: FormPlugin): void {
        plugin.app.embedRegistry.unregisterExtensions(["cform"]);
    }
}

export const applicationFileViewService = new ApplicationFileViewService();