import { App } from "obsidian";
import { IFormAction } from "../../model/action/IFormAction";
import { FormConfig } from "../../model/FormConfig";
import { FormState } from "../FormState";
import CreateFileActionService from "./create-file/CreateFileActionService";
import GenerateFormActionService from "./generate-form/GenerateFormActionService";
import InsertTextActionService from "./insert-text/InsertTextActionService";
import RunScriptActionService from "./run-script/RunScriptActionService";
import SuggestModalActionService from "./suggest-modal/SuggestModalActionService";
import UpdateFrontmatterActionService from "./update-frontmatter/UpdateFrontmatterActionService";
import { hasConditions } from "./util/hasConditions";
import { FilterService } from "../filter/FilterService";

export interface IActionService {

    accept(action: IFormAction, context: ActionContext): boolean;

    run(action: IFormAction, context: ActionContext, chain: ActionChain): Promise<any>;
}

export interface ActionContext {
    state: FormState;
    config: FormConfig;
    app: App;
}

export class ActionChain {
    index = 0;
    actions: IFormAction[] = [];

    private actionServices: IActionService[] = [
        new CreateFileActionService(),
        new InsertTextActionService(),
        new RunScriptActionService(),
        new SuggestModalActionService(),
        new UpdateFrontmatterActionService(),
        new GenerateFormActionService(),
    ]

    constructor(actions: IFormAction[]) {
        this.actions = actions;
    }

    validate(context: ActionContext) {
        // ensure all action can match a service to run
        for (const action of this.actions) {
            const actionService = this.actionServices.find(service => service.accept(action, context));
            if (!actionService) {
                throw new Error(`No action service found for action type ${action.type}`);
            }
        }
    }

    async next(context: ActionContext) {
        if (this.index >= this.actions.length) {
            return Promise.resolve();
        }
        const action = this.actions[this.index];
        this.index++;
        const actionService = this.actionServices.find(service => service.accept(action, context));
        if (!actionService) {
            throw new Error(`No action service found for action type ${action.type}`);
        }

        if (hasConditions(action)) {
            const idValues = context.state.idValues;
            const isMatch = FilterService.match(action.condition!,
                prop => prop ? idValues[prop] : undefined,
                value => value === undefined ? undefined : value
            )
            if (isMatch) {
                await actionService.run(action, context, this);
            } else {
                await this.next(context);
            }
        } else {
            await actionService.run(action, context, this);
        }

    }
}