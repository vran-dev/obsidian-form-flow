import { App } from "obsidian";
import { PropertyType } from "./PropertyType";

export interface Property {
    label?: string;
    name: string;
    // "text" | "number" | "datetime" | "date" | "multitext" | "checkbox";
    type?: string | PropertyType;
}

export function getAllProperties(app: App) {
    const properties: Property[] = [];
    const pageProperties = app.metadataTypeManager.getAllProperties();
    // get all values
    for (const property in pageProperties) {
        // @ts-ignore
        const propType = pageProperties[property].widget ?? pageProperties[property].type ?? "text"
        properties.push({
            name: pageProperties[property].name,
            label: pageProperties[property].name,
            type: propType,
        });
    }
    return properties;
}