import { FormActionType } from "../enums/FormActionType";
import { TargetFileType } from "../enums/TargetFileType";
import { FileBaseFormAction } from "./FileBaseFormAction";

export class UpdateFrontmatterFormAction extends FileBaseFormAction {

    type: FormActionType.UPDATE_FRONTMATTER;

    targetFileType: TargetFileType;

    propertyUpdates: PropertyUpdate[];

    newFileTemplate?: string;

    constructor(partial?: Partial<UpdateFrontmatterFormAction>) {
        super(partial);
        this.type = FormActionType.UPDATE_FRONTMATTER;
        this.targetFileType = TargetFileType.SPECIFIED_FILE;
        this.propertyUpdates = [];
        this.newFileTemplate = "";
        Object.assign(this, partial);
    }
}

export interface PropertyUpdate {
    id: string;
    name: string;
    value: any;
}