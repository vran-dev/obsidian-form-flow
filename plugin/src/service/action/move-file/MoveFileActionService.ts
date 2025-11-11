import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import { getFilePathFromAction } from "../util/getFilePathFromAction";
import { normalizePath } from "obsidian";

export default class MoveFileActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.MOVE_FILE;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain) {
        const formAction = action as MoveFileFormAction;
        const app = context.app;

        try {
            // Use the unified file path resolution utility
            const fileToMovePath = await getFilePathFromAction(formAction, context);
            
            if (!fileToMovePath) {
                console.error('[MoveFileActionService] No file to move');
                return;
            }

            const sourceFile = app.vault.getAbstractFileByPath(fileToMovePath);
            if (!sourceFile) {
                console.error('[MoveFileActionService] Source file not found:', fileToMovePath);
                return;
            }

            // Build target path
            const fileName = fileToMovePath.split('/').pop();
            const targetPath = normalizePath(formAction.moveTargetFolder + '/' + fileName);
            
            await app.fileManager.renameFile(sourceFile, targetPath);
            
        } catch (error) {
            console.error('[MoveFileActionService] Error moving file:', error);
            return;
        }
            
        // do next
        await chain.next(context);
    }

}   
