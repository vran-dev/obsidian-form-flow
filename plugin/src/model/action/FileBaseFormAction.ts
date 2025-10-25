import { BaseFormAction } from "./BaseFormAction";
import { IFormAction } from "./IFormAction";

export abstract class FileBaseFormAction extends BaseFormAction {

    filePath: string;

    /**
     * @deprecated use filePath instead
     */
    targetFolder: string;

    /**
     * @deprecated use filePath instead
     */
    fileName: string;

    constructor(partial?: Partial<FileBaseFormAction>) {
        super(partial);
        this.filePath = "";
        this.targetFolder = "";
        this.fileName = "";
        Object.assign(this, partial);
    }
}