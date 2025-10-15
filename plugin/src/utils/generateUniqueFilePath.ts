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
    
    // Extract directory, filename and extension
    const lastSlashIndex = normalizedPath.lastIndexOf("/");
    const directory = lastSlashIndex >= 0 ? normalizedPath.substring(0, lastSlashIndex) : "";
    const fullFileName = lastSlashIndex >= 0 ? normalizedPath.substring(lastSlashIndex + 1) : normalizedPath;
    
    const lastDotIndex = fullFileName.lastIndexOf(".");
    const fileName = lastDotIndex >= 0 ? fullFileName.substring(0, lastDotIndex) : fullFileName;
    const extension = lastDotIndex >= 0 ? fullFileName.substring(lastDotIndex) : "";
    
    // Use the same pattern as generateSequenceName: try numbered suffixes
    let uniqueName = fileName;
    for (let suffix = 1; suffix < 10000; suffix++) {
        const testFileName = uniqueName + extension;
        const testPath = directory ? `${directory}/${testFileName}` : testFileName;
        const testNormalizedPath = normalizePath(testPath);
        
        if (!app.vault.getAbstractFileByPath(testNormalizedPath)) {
            return testNormalizedPath;
        }
        
        uniqueName = fileName + " " + suffix;
    }
    
    // Fallback (should never reach here)
    return normalizedPath;
}