import { AbstractInputSuggest, TFolder, App } from "obsidian";

export default class extends AbstractInputSuggest<TFolder> {
    constructor(public app: App, textInputEl: HTMLInputElement) {
        super(app, textInputEl);
    }

    protected getSuggestions(query: string): TFolder[] | Promise<TFolder[]> {
        return this.app.vault
            .getAllFolders()
            .filter((f) =>
                f.path.toLowerCase().includes((query || "").toLowerCase())
            );
    }
    renderSuggestion(value: TFolder, el: HTMLElement): void {
        el.setText(value.path);
    }
}