import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export default class MoveFileActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.MOVE_FILE;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain) {
        const formAction = action as MoveFileFormAction;
        const app = context.app;
        const activeFile = app.workspace.getActiveFile();

        const fileToMovePath = formAction.isCurrentFile
            ? (activeFile?.path ?? '')
            : formAction.file;
            
        if (!fileToMovePath) {
            console.error('[MoveFileActionService] No file to move');
            return;
        }
        app.fileManager.renameFile(
            context.app.vault.getAbstractFileByPath(fileToMovePath)!,
            formAction.targetFolder+'/'+fileToMovePath.split('/').pop()
        );
            
        // do next
        await chain.next(context);
    }

}   