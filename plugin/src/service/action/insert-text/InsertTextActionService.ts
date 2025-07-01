import { App } from "obsidian";
import { IFormAction } from "src/model/action/IFormAction";
import { InsertTextFormAction } from "src/model/action/InsertTextFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { OpenPageInType } from "src/model/enums/OpenPageInType";
import { TargetFileType } from "src/model/enums/TargetFileType";
import { TextInsertPosition } from "src/model/enums/TextInsertPosition";
import { openFilePathDirectly } from "src/utils/openFilePathDirectly";
import { FormTemplateProcessEngine } from "../../engine/FormTemplateProcessEngine";
import { FormState } from "../../FormState";
import { ActionChain, ActionContext, IActionService } from "../IActionService";
import { createFileFromActionIfNotExists } from "../util/createFileFromActionIfNotExists";
import { getFilePathFromAction } from "../util/getFilePathFromAction";
import { validateFileName } from "../util/validateFileName";
import ContentInsertionService from "./ContentInsertionService";

export default class InsertTextActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.INSERT_TEXT;
    }

    async run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const formAction = action as InsertTextFormAction;
        const state = context.state;
        await validateFileName(formAction, context);
        const file = await this.getFile(formAction, context);
        await this.inserText(file.path, state, formAction, context);
        // do next
        await chain.next(context);
    }

    private async getFile(formAction: InsertTextFormAction, context: ActionContext) {
        const filePath = await getFilePathFromAction(formAction, context);
        const file = await createFileFromActionIfNotExists(filePath, formAction, context);
        return file;
    }

    private async inserText(filePath: string, state: FormState, formAction: InsertTextFormAction, context: ActionContext) {
        const app = context.app;
        const insertionService = new ContentInsertionService();
        const content = await this.processContent(formAction.content, state, context.app);
        const position = formAction.position;
        if (position === TextInsertPosition.TOP_OF_CONTENT) {
            await insertionService.insertToTopOfNote(app, filePath, content);
        } else if (position === TextInsertPosition.END_OF_CONTENT) {
            await insertionService.insertToBottomOfNote(app, filePath, content);
        } else if (position === TextInsertPosition.TOP_BELOW_TITLE && formAction.heading) {
            const heading = await this.processContent(formAction.heading, state, context.app);
            await insertionService.insertToTopBelowTitle(app, filePath, heading, content);
        } else if (position === TextInsertPosition.BOTTOM_BELOW_TITLE && formAction.heading) {
            const heading = await this.processContent(formAction.heading, state, context.app);
            await insertionService.insertToBottomBelowTitle(app, filePath, heading, content);
        } else if (formAction.position === TextInsertPosition.AT_CURSOR && formAction.targetFileType === TargetFileType.CURRENT_FILE) {
            const content = await this.processContent(formAction.content, state, context.app);
            await insertionService.insertToCurrentCursor(app, content);
            return Promise.resolve();
        } else {
            await insertionService.insertToBottomOfNote(app, filePath, content);
        }
        if (formAction.targetFileType !== TargetFileType.CURRENT_FILE) {
            openFilePathDirectly(app, filePath, formAction.openPageIn || OpenPageInType.none);
        }
        return Promise.resolve();
    }

    /**
     * 处理内容中的变量替换
     * @param content 原始内容
     * @param state 表单状态
     * @returns 处理后的内容
     */
    private async processContent(content: string, state: FormState, app: App): Promise<string> {
        const engine = new FormTemplateProcessEngine();
        return engine.process(content, state, app);
    }

}