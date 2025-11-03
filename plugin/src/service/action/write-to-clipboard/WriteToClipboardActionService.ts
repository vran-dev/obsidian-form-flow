import { IFormAction } from "src/model/action/IFormAction";
import { WriteToClipboardFormAction } from "src/model/action/WriteToClipboardFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export default class WriteToClipboardActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.WRITE_TO_CLIPBOARD;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const formAction = action as WriteToClipboardFormAction;
        const state = context.state;
        const app = context.app;

        try {
            // Process template variables in content
            const templateEngine = new FormTemplateProcessEngine();
            const processedContent = await templateEngine.process(formAction.content, state, app);
            
            // Write to clipboard
            await navigator.clipboard.writeText(processedContent);
        } catch (error) {
            console.error("Failed to write to clipboard:", error);
        }
        
        // Continue to next action
        return await chain.next(context);
    }
}