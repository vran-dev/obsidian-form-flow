import { IFormAction } from "src/model/action/IFormAction";
import { GenerateFormAction } from "src/model/action/OpenFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import FormModal from "./FormModal";

export default class GenerateFormActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.GENERATE_FORM;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const state = context.state;
        const formAction = action as GenerateFormAction;
        return new Promise((resolve) => {
            const modal = new FormModal(context.app,
                formAction.fields || [],
                async (value) => {
                    state.values = {
                        ...state.values,
                        ...value,
                    }
                    modal.close();
                    await chain.next(context);
                    resolve();
                },
                () => {
                    resolve();
                }
            )
            modal.open();
        })
    }

}