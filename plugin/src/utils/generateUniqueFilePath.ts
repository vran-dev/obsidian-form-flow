import { App, normalizePath } from "obsidian";

/**
 * Generates a unique file path by appending a number suffix when conflicts occur
 */
export function generateUniqueFilePath(app: App, originalPath: string): string {
    const normalizedPath = normalizePath(originalPath);
    
    // If no conflict, return the original path
    if (!app.vault.getAbstractFileByPath(normalizedPath)) {
        return normalizedPath;
    }
    
    // Extract the extension from the original path
    const lastDotIndex = normalizedPath.lastIndexOf(".");
    const pathWithoutExtension = lastDotIndex >= 0 ? normalizedPath.substring(0, lastDotIndex) : normalizedPath;
    const extension = lastDotIndex >= 0 ? normalizedPath.substring(lastDotIndex + 1) : "";
    
    // Use Obsidian's getAvailablePath API to generate unique path
    return app.vault.getAvailablePath(pathWithoutExtension, extension);
}