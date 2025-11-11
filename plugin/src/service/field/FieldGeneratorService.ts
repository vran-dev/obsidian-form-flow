import { IFormField } from "src/model/field/IFormField";
import { App } from 'obsidian';
import { IPropertyValueField } from "src/model/field/IPropertyValueField";
import { FormFieldType } from "src/model/enums/FormFieldType";
import { v4 } from "uuid";
import { ICheckboxField } from "src/model/field/ICheckboxField";
import { INumberField } from "src/model/field/INumberField";

export class FieldGeneratorService {

    generateFromMarkdownFrontmatter(app: App, path: string): IFormField[] {
        const file = app.vault.getFileByPath(path);
        if (!file) {
            return [];
        }
        const metadata = app.metadataCache.getFileCache(file);
        if (!metadata || !metadata.frontmatter) {
            return [];
        }
        const properties = Object.keys(metadata.frontmatter);
        return properties.map(prop => {
            const propertyInfo = app.metadataTypeManager.getPropertyInfo(prop);
            if (propertyInfo) {
                if (propertyInfo.type === 'tags' ||
                    propertyInfo.type === 'aliases' ||
                    propertyInfo.type === 'multitext'
                ) {
                    const field: IPropertyValueField = {
                        id: v4(),
                        label: prop,
                        type: FormFieldType.PROPERTY_VALUE_SUGGESTION,
                        propertyName: prop,
                        multiple: true,
                        required: true
                    }
                    return field;
                }

                if (propertyInfo.type === 'checkbox') {
                    const field: ICheckboxField = {
                        id: v4(),
                        label: prop,
                        type: FormFieldType.CHECKBOX,
                        required: true
                    }
                    return field;
                }

                if (propertyInfo.type === 'number') {
                    const field: INumberField = {
                        id: v4(),
                        label: prop,
                        type: FormFieldType.NUMBER,
                        required: true
                    }
                    return field;
                }

            }
            const field: IPropertyValueField = {
                id: v4(),
                label: prop,
                type: FormFieldType.PROPERTY_VALUE_SUGGESTION,
                propertyName: prop,
                multiple: false,
                required: true
            }
            return field;

        })
    }

}

export const fieldGeneratorServiceInstance = new FieldGeneratorService();