import { App, TFile } from "obsidian";
import FormViewModal2 from "src/component/modal/FormViewModal2";
import { localInstance } from "src/i18n/locals";
import { showPromiseToast } from "../component/toast/PromiseToast";
import { ToastManager } from "../component/toast/ToastManager";
import { FormConfig } from "../model/FormConfig";
import { getActionsCompatible } from "../utils/getActionsCompatible";
import { resolveDefaultFormIdValues } from "../utils/resolveDefaultFormIdValues";
import { ActionChain, ActionContext } from "./action/IActionService";
import { FormVisibilies } from "./condition/FormVisibilies";
import { FormIdValues } from "./FormValues";
import { FormValidator } from "./validator/FormValidator";

export interface FormSubmitOptions {
    app: App
}

export class FormService {

    async submit(idValues: FormIdValues, config: FormConfig, options: FormSubmitOptions) {
        const actions = getActionsCompatible(config);
        FormValidator.validate(config, idValues);
        const chain = new ActionChain(actions);
        const visibleIdValues = FormVisibilies.getVisibleIdValues(config.fields, idValues);
        const formLabelValues = FormVisibilies.toFormLabelValues(config.fields, idValues);
        const actionContext: ActionContext = {
            app: options.app,
            config: config,
            state: {
                idValues: visibleIdValues,
                values: formLabelValues,
            }
        }
        chain.validate(actionContext);
        // run all action sequentially
        await chain.next(actionContext);
    }

    async submitDirectly(formConfig: FormConfig, app: App) {
        try {
            const formIdValues = resolveDefaultFormIdValues(formConfig.fields);
            const context: FormSubmitOptions = {
                app: app,
            };
            const promise = this.submit(formIdValues, formConfig, context);
            showPromiseToast(promise, {
                loadingMessage: localInstance.handling,
                successMessage: localInstance.submit_success,
                successDuration: 3000
            });
            return promise;
        } catch (e) {
            ToastManager.error(e.message || localInstance.unknown_error, 5000);
        }
    }

    async open(file: TFile, app: App) {
        const form = await app.vault.readJson(file.path) as FormConfig;
        if (form.autoSubmit === true) {
            const formService = new FormService();
            await formService.submitDirectly(form, app);
        } else {
            const m = new FormViewModal2(app, {
                formFilePath: file.path,
            });
            m.open();
        }
    }

    async openForm(formConfig: FormConfig, app: App) {
        if (formConfig.autoSubmit === true) {
            const formService = new FormService();
            await formService.submitDirectly(formConfig, app);
        } else {
            const m = new FormViewModal2(app, {
                formConfig: formConfig,
            });
            m.open();
        }
    }
}