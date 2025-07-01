import { App } from "obsidian";
import getPropertyTypeByName from "./getPropertyTypeByName";

export function isMultiTextProperty(app: App, propertyName?: string | null): boolean {
    if (propertyName === null || propertyName === undefined || propertyName === "") {
        return false
    }
    const isMulti = ["tags", "cssclasses", "aliases"].includes(
        propertyName.toLocaleLowerCase()
    );
    if (isMulti) {
        return true;
    }

    const propType = getPropertyTypeByName(app, propertyName);
    return propType === "multitext";
}