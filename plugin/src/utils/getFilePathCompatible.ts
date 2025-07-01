import { FileBaseFormAction } from "../model/action/FileBaseFormAction";
import { normalizePath } from "obsidian";
import { Strings } from "./Strings";

export function getFilePathCompatible(action: FileBaseFormAction) {
    if (Strings.isNotEmpty(action.filePath)) {
        return action.filePath;
    }
    const path =
        normalizePath(action.targetFolder) +
        "/" +
        normalizePath(action.fileName)

    if (Strings.isBlank(action.targetFolder) && Strings.isBlank(action.fileName)) {
        return "";
    }
    return normalizePath(path + ".md");
}
