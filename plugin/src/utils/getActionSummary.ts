import { localInstance } from "src/i18n/locals";
import { CreateFileFormAction } from "../model/action/CreateFileFormAction";
import { InsertTextFormAction } from "../model/action/InsertTextFormAction";
import { UpdateFrontmatterFormAction } from "../model/action/UpdateFrontmatterFormAction";
import { FormActionType } from "../model/enums/FormActionType";
import { PropertyUpdateOperation } from "../model/enums/PropertyUpdateOperation";
import { TargetFileType } from "../model/enums/TargetFileType";

export function getActionSummary(action: CreateFileFormAction | InsertTextFormAction | UpdateFrontmatterFormAction): Array<{ label: string; value: string }> {
    const summary: Array<{ label: string; value: string }> = [];

    switch (action.type) {
        case FormActionType.CREATE_FILE:
            if (action.filePath) {
                summary.push({
                    label: localInstance.file_path,
                    value: action.filePath
                });
            }
            break;

        case FormActionType.INSERT_TEXT:
            if (action.targetFileType === TargetFileType.CURRENT_FILE) {
                summary.push({
                    label: localInstance.target_file,
                    value: localInstance.in_current_file
                });
            } else {
                if (action.filePath) {
                    summary.push({
                        label: localInstance.file_path,
                        value: action.filePath
                    });
                }

            }

            if (action.content) {
                const contentPreview = action.content.length > 30
                    ? action.content.substring(0, 30) + '...'
                    : action.content;
                summary.push({
                    label: localInstance.content,
                    value: contentPreview
                });
            }
            break;

        case FormActionType.UPDATE_FRONTMATTER:
            if (action.targetFileType === TargetFileType.CURRENT_FILE) {
                summary.push({
                    label: localInstance.target_file,
                    value: localInstance.in_current_file
                });
            } else {
                if (action.filePath) {
                    summary.push({
                        label: localInstance.file_path,
                        value: action.filePath
                    });
                }
            }

            const propertyUpdates = action.propertyUpdates || [];
            if (propertyUpdates.length > 0) {
                const propertiesList = propertyUpdates.map(update => {
                    const operation = update.operation || PropertyUpdateOperation.SET;
                    if (operation === PropertyUpdateOperation.SET) {
                        return update.name;
                    }
                    const opLabel = operation === PropertyUpdateOperation.ADD
                        ? localInstance.property_operation_add
                        : localInstance.property_operation_remove;
                    return `${update.name}[${opLabel}]`;
                }).join(', ');
                summary.push({
                    label: localInstance.property,
                    value: propertiesList
                });
            }
            break;
    }

    return summary;
}