import { IFormAction } from "src/model/action/IFormAction";
import { RunScriptFormAction, ScriptSourceType } from "src/model/action/RunScriptFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import { FormScriptComipler } from "src/service/extend/FormScriptComipler";
import { FormScriptRunner } from "src/service/extend/FormScriptRunner";
import { formScriptService } from "src/service/extend/FormScriptService";

export default class RunScriptActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.RUN_SCRIPT;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const scriptAction = action as RunScriptFormAction;
        const state = context.state;
        const extraContext = {
            form: state.values,
        }

        if (scriptAction.scriptSource === ScriptSourceType.INLINE) {
            const code = scriptAction.code;
            const extension = await FormScriptComipler.compile(action.id, code, {
                name: "entry"
            });
            if (!extension) {
                throw new Error("Invalid script code");
            }
            await FormScriptRunner.runFunction(context.app, extension, extraContext)
        } else {
            await formScriptService.run(scriptAction.expression, extraContext);
        }

        // do next
        return await chain.next(context);
    }

}