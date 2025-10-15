import { FormActionType } from "../enums/FormActionType";
import { OpenPageInType } from "../enums/OpenPageInType";
import { FileConflictResolution } from "../enums/FileConflictResolution";
import { FileBaseFormAction } from "./FileBaseFormAction";

export interface CreateFileFormAction extends FileBaseFormAction {
    type: FormActionType.CREATE_FILE;
    openPageIn: OpenPageInType;
    contentTemplateSource: ContentTemplateSource;
    content: string;
    templateFile: string;
    conflictResolution?: FileConflictResolution;
}

export enum ContentTemplateSource {
    FILE = "file",
    TEXT = "text",
}