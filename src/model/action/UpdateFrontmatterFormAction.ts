import { FormActionType } from "../enums/FormActionType";
import { TargetFileType } from "../enums/TargetFileType";
import { FileBaseFormAction } from "./FileBaseFormAction";

export interface UpdateFrontmatterFormAction extends FileBaseFormAction {

    type: FormActionType.UPDATE_FRONTMATTER;

    targetFileType: TargetFileType;

    propertyUpdates: PropertyUpdate[];

    newFileTemplate?: string;
}

export interface PropertyUpdate {
    id: string;
    name: string;
    value: any;
}