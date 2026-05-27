import { IFormAction } from "src/model/action/IFormAction";
import { UpdateFrontmatterFormAction } from "src/model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { PropertyUpdateOperation } from "src/model/enums/PropertyUpdateOperation";
import { FormTemplateProcessEngine } from "src/service/engine/FormTemplateProcessEngine";
import { convertFrontmatterValue } from "src/utils/convertFrontmatterValue";
import { IActionService, ActionContext, ActionChain } from "../IActionService";
import { createFileFromActionIfNotExists } from "../util/createFileFromActionIfNotExists";
import { getFilePathFromAction } from "../util/getFilePathFromAction";
import { validateFileName } from "../util/validateFileName";


export default class UpdateFrontmatterActionService implements IActionService {

    accept(action: IFormAction, context: ActionContext): boolean {
        return action.type === FormActionType.UPDATE_FRONTMATTER;
    }

    async run(action: UpdateFrontmatterFormAction, context: ActionContext, chain: ActionChain): Promise<void> {
        const app = context.app;
        const engien = new FormTemplateProcessEngine();
        await validateFileName(action, context);

        const formatted: {
            name: string;
            value: string | string[];
            operation: PropertyUpdateOperation;
        }[] = []
        for (const property of action.propertyUpdates) {
            const name = await engien.process(property.name, context.state, app);
            let value;
            if (Array.isArray(property.value)) {
                value = [];
                for (const item of property.value) {
                    const res = await engien.process(item, context.state, app);
                    if (Array.isArray(res)) {
                        value.push(...res);
                    } else {
                        value.push(res);
                    }
                }
            } else {
                value = await engien.process(property.value, context.state, app);
            }
            formatted.push({
                name: name,
                value: value,
                operation: property.operation || PropertyUpdateOperation.SET,
            })
        }
        const filePath = await getFilePathFromAction(action, context);
        const file = await createFileFromActionIfNotExists(filePath, action, context);
        await app.fileManager.processFrontMatter(file, (frontmatter) => {
            for (const property of formatted) {
                const convertedValue = convertFrontmatterValue(app, property.name, property.value);
                switch (property.operation) {
                    case PropertyUpdateOperation.ADD:
                        if (Array.isArray(frontmatter[property.name])) {
                            const existing = frontmatter[property.name] as any[];
                            const toAdd = Array.isArray(convertedValue) ? convertedValue : [convertedValue];
                            const merged = [...new Set([...existing, ...toAdd])];
                            frontmatter[property.name] = convertFrontmatterValue(app, property.name, merged);
                        } else if (frontmatter[property.name] === undefined || frontmatter[property.name] === null) {
                            frontmatter[property.name] = convertedValue;
                        }
                        break;
                    case PropertyUpdateOperation.REMOVE:
                        delete frontmatter[property.name];
                        break;
                    case PropertyUpdateOperation.SET:
                    default:
                        frontmatter[property.name] = convertedValue;
                        break;
                }
            }
        });
        return await chain.next(context);
    }
}