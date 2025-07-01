import { FormConfig } from "../model/FormConfig";

export function getActionsCompatible(config: FormConfig) {
    if (!config.action) {
        return config.actions || [];
    }
    const actions = config.actions || [];
    const action = config.action;

    // already contains old action
    if (actions.find((a) => a.id === action.id)) {
        return actions;
    }

    return [action, ...actions];
}
