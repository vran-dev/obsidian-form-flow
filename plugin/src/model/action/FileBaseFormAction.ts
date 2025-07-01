import { IFormAction } from "./IFormAction";

export interface FileBaseFormAction extends IFormAction {

    filePath: string;

    /**
     * @deprecated use filePath instead
     */
    targetFolder: string;

    /**
     * @deprecated use filePath instead
     */
    fileName: string;

}