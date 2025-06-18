import { AbstractInputSuggest, TFolder, App } from "obsidian";

export default class extends AbstractInputSuggest<TFolder> {
    constructor(public app: App, textInputEl: HTMLInputElement) {
        super(app, textInputEl);
    }

    protected getSuggestions(query: string): TFolder[] | Promise<TFolder[]> {
        return this.app.vault
            .getAllLoadedFiles()
            .filter((f) => f instanceof TFolder)
            .filter((f) =>
                f.path.toLowerCase().includes((query || "").toLowerCase())
            ) as TFolder[];
    }
    renderSuggestion(value: TFolder, el: HTMLElement): void {
        el.setText(value.path);
    }
}