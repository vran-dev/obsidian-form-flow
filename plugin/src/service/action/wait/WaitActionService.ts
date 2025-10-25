import { IFormAction } from "src/model/action/IFormAction";
import { WaitFormAction, DEFAULT_WAIT_TIME } from "src/model/action/WaitFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export default class WaitActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.WAIT;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const waitAction = action as WaitFormAction;
        
        // Use default time if not specified
        const milliseconds = waitAction.waitTime ?? DEFAULT_WAIT_TIME;
        
        // Execute wait logic
        await this.wait(milliseconds);
        
        // Continue to next action in chain
        await chain.next(context);
    }

    private async wait(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}