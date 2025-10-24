import { IFormAction } from "src/model/action/IFormAction";
import { WaitFormAction } from "src/model/action/WaitFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { WaitTimeUnit } from "src/model/enums/WaitTimeUnit";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export default class WaitActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.WAIT;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const waitAction = action as WaitFormAction;
        
        // Convert wait time to milliseconds based on unit
        const milliseconds = this.convertToMilliseconds(waitAction.waitTime, waitAction.unit);
        
        // Execute wait logic
        await this.wait(milliseconds);
        
        // Continue to next action in chain
        await chain.next(context);
    }

    private convertToMilliseconds(time: number, unit: WaitTimeUnit): number {
        switch (unit) {
            case WaitTimeUnit.MILLISECONDS:
                return time;
            case WaitTimeUnit.SECONDS:
                return time * 1000;
            case WaitTimeUnit.MINUTES:
                return time * 60 * 1000;
            default:
                return time; // Default to milliseconds
        }
    }

    private async wait(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}