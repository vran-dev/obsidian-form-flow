import { App } from "obsidian";
import getPropertyTypeByName from "./getPropertyTypeByName";

export function convertFrontmatterValue(app: App, name: string, value: any) {
    const t = getPropertyTypeByName(app, name)
    switch (t) {
        case "checkbox":
            return value === true || value === "true";
        case "number":
            return Number(value);
        default:
            return value;
    }
}