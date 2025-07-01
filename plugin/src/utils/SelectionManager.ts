export class SelectionManager {
    private static savedRange: Range | null = null;

    static saveCurrentSelection() {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.savedRange = selection.getRangeAt(0).cloneRange();
        }
    }

    static getSavedSelectionRect(): DOMRect | null {
        if (this.savedRange) {
            return this.savedRange.getBoundingClientRect();
        }
        return null;
    }
}