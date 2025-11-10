import { MoveFileFormAction } from "src/model/action/MoveFileFormAction";
import { IFormAction } from "src/model/action/IFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { getFilePathFromAction } from "../util/getFilePathFromAction";
import { createFileFromActionIfNotExists } from "../util/createFileFromActionIfNotExists";
import { ActionChain, ActionContext, IActionService } from "../IActionService";

export default class MoveFileActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.MOVE_FILE;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain) {
        const formAction = action as MoveFileFormAction;
        const filePath = await getFilePathFromAction(formAction, context);
        if (!filePath) {
            console.log('MoveFileActionService', 'filePath is null');
            return;
        }
        const file = await createFileFromActionIfNotExists(filePath, formAction, context);

        context.app.fileManager.renameFile(
            file,
            formAction.targetFolder+'/'+filePath.split('/').pop()
        );        
        // do next
        await chain.next(context);
    }

}   