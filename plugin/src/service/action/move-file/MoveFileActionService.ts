import { TFile } from "obsidian";
import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import { getFilePathFromAction } from "../util/getFilePathFromAction";
import { normalizePath } from "obsidian";
import { FormTemplateProcessEngine } from "src/service/engine/FormTemplateProcessEngine";
import { localInstance } from "src/i18n/locals";

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
                throw new Error(localInstance.no_file_to_move);
            }

            const sourceFile = app.vault.getAbstractFileByPath(fileToMovePath);
            if (!sourceFile) {
                console.error('[MoveFileActionService] Source file not found:', fileToMovePath);
                throw new Error(localInstance.source_file_not_found);
            }

            // Build target path
            const engine = new FormTemplateProcessEngine();
            const fileName = fileToMovePath.split('/').pop();
            const moveTargetFolder = await engine.process(formAction.moveTargetFolder, context.state, app);
            const targetPath = normalizePath(moveTargetFolder + '/' + fileName);
            const file = app.vault.getAbstractFileByPath(targetPath);
            if (file) {
                console.error('[MoveFileActionService] Target path exist:', targetPath);
                throw new Error(localInstance.move_failed_by_file_name_conflict);
            }
            await app.fileManager.renameFile(sourceFile, targetPath);
        } catch (error) {
            console.error('[MoveFileActionService] Error moving file:', error);
            throw new Error(error);
        }
        // do next
        await chain.next(context);
    }

}   
