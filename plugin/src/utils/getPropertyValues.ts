import { App } from "obsidian";
import { Objects } from "./Objects";
import getPropertyTypeByName from "./getPropertyTypeByName";
import { PropertyType } from "./PropertyType";

export function getPropertyValues(app: App, property: string): any[] {
    const values = app.metadataCache.getFrontmatterPropertyValuesForKey(property);
    if (!Objects.isNullOrUndefined(values) || values.length == 0) {
        const propType = getPropertyTypeByName(app, property);
        if (propType == PropertyType.checkbox) {
            return ["true", "false"];
        }
    }
    return values;
}