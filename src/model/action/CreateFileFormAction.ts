import { FormActionType } from "../enums/FormActionType";
import { OpenPageInType } from "../enums/OpenPageInType";
import { FileBaseFormAction } from "./FileBaseFormAction";

export interface CreateFileFormAction extends FileBaseFormAction {
    type: FormActionType.CREATE_FILE;
    openPageIn: OpenPageInType;
    contentTemplateSource: ContentTemplateSource;
    content: string;
    templateFile: string;
}

export enum ContentTemplateSource {
    FILE = "file",
    TEXT = "text",
}