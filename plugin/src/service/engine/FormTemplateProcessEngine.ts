import { FormState } from "../FormState";
import { App } from "obsidian";
import TemplateParser from "./TemplateParser";
import { getEditorSelection } from "src/utils/getEditorSelection";
import { processObTemplate } from "src/utils/templates";

export class FormTemplateProcessEngine {
    async process(text: string, state: FormState, app: App) {
        if (!text || text === "") {
            return "";
        }

        // if exactly matches {{@variableName}}, return the value directly
        const pureVariableMatch = text.match(/^{{\@([^}]+)}}$/);
        if (pureVariableMatch) {
            const variableName = pureVariableMatch[1];
            const value = state.values[variableName];
            if (value !== undefined && value !== null) {
                return value;
            }
            return "";
        }

        let res = text;
        res = TemplateParser.compile(res, state);

        // handle {{selection}}
        const selectionVariable = "{{selection}}";
        if (res.includes(selectionVariable)) {
            const selectedText = getEditorSelection(app);
            res = res.replace(selectionVariable, selectedText);
        }

        // handle {{clipboard}}
        const clipboardVariable = "{{clipboard}}";
        if (res.includes(clipboardVariable)) {
            const clipboardText = await navigator.clipboard.readText();
            res = res.replace(clipboardVariable, clipboardText);
        }

        // 最后处理 Obsidian 格式模板
        res = processObTemplate(res);
        return res;
    }
}