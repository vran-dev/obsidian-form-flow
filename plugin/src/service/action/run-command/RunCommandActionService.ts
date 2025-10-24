import { IFormAction } from "src/model/action/IFormAction";
import { RunCommandFormAction } from "src/model/action/RunCommandFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export class RunCommandActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.RUN_COMMAND;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain) {
        const formAction = action as RunCommandFormAction;
        const app = context.app;
        const commandId = formAction?.commandId;
        if (!commandId) {
            return Promise.reject();
        }
        app.commands.executeCommandById(commandId);
        return await chain.next(context);
    }

}