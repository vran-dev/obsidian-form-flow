import { IFormAction } from "src/model/action/IFormAction";
import { SuggestModalFormAction } from "src/model/action/SuggestModalFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { FormScriptComipler } from "src/service/extend/FormScriptComipler";
import { FormScriptRunner } from "src/service/extend/FormScriptRunner";
import { Strings } from "src/utils/Strings";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import CommonSuggestModal from "src/component/modal/CommonSuggestModal";

type ObjectItem = {
    label: string;
    value?: string;
}

type ValueItem = string | ObjectItem;

export default class SuggestModalActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.SUGGEST_MODAL;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const state = context.state;
        const suggestAction = action as SuggestModalFormAction;

        let items: string[] | ObjectItem[] = [];
        if (suggestAction.suggestSource === "script") {
            items = await this.resolveItemsFromScript(suggestAction, context, chain);
        } else {
            items = suggestAction.items || [];
        }

        if (!items || items.length === 0) {
            await chain.next(context);
            return;
        }

        return new Promise((resolve) => {
            const itemLabels = items.map((item: ValueItem) =>
                typeof item === "string" ? item : item.label
            );


            const suggestModal = new CommonSuggestModal(context.app, itemLabels, async (value) => {
                const selectedItem = items.length > 0 && typeof items[0] === "string"
                    ? (items as string[]).find(item => item === value)
                    : (items as ObjectItem[]).find(item => item.label === value);


                let selected: string;
                if (typeof selectedItem === "string") {
                    selected = selectedItem;
                } else {
                    selected = Strings.defaultIfBlank(selectedItem?.value, selectedItem?.label || "");
                }
                selected = await new FormTemplateProcessEngine().process(selected, state, context.app)
                state.values[suggestAction.fieldName] = selected;
                resolve(chain.next(context));
            })
            suggestModal.onCancel = () => {
                resolve();
            }
            suggestModal.setTitle(suggestAction.fieldName)
            suggestModal.open();
        })
    }

    private async resolveItemsFromScript(action: SuggestModalFormAction, context: ActionContext, chain: ActionChain): Promise<string[] | ObjectItem[]> {
        const code = action.code;
        if (!code || code.trim() === "") {
            throw new Error("No code provided for suggest modal");
        }
        const extension = await FormScriptComipler.compile(action.id, code, {
            name: "entry"
        });
        if (!extension) {
            throw new Error("Invalid script code");
        }
        const state = context.state;
        const result = await FormScriptRunner.runFunction(context.app, extension, {
            form: state.values,
        })

        if (Array.isArray(result)) {
            // must be an array<string> or array<SuggestItem>
            if (result.length > 0) {
                const firstItem = result[0];
                if (typeof firstItem === "string") {
                    return result as string[];
                } else if (typeof firstItem === "object" && "label" in firstItem && "value" in firstItem) {
                    return result as ObjectItem[];
                } else {
                    throw new Error("Invalid item type, must be string or object with label and value '{ label: string, value: string }'");
                }
            }
            return result;
        } else {
            throw new Error("Return value must be an array");
        }
    }

}