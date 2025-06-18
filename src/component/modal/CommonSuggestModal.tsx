import { App, FuzzyMatch, FuzzySuggestModal } from "obsidian";
import { localInstance } from "src/i18n/locals";

type SuggestModel =
	| {
			label: string;
			value: string;
	}
	| string;

export default class extends FuzzySuggestModal<SuggestModel> {
	emptyStateText: string = localInstance.enter_to_create;
	isCancel = true;

	constructor(
		app: App,
		public items: SuggestModel[],
		public onChoose: (
			value: SuggestModel,
			evt: MouseEvent | KeyboardEvent
		) => void,
		public onCancel?: () => void
	) {
		super(app);
		this.onChoose = onChoose;
	}

	getItems(): SuggestModel[] {
		return this.items;
	}
	getItemText(item: SuggestModel): string {
		if (typeof item === "string") {
			return item;
		} else {
			return item.label;
		}
	}

	selectSuggestion(
		value: FuzzyMatch<SuggestModel>,
		evt: MouseEvent | KeyboardEvent
	): void {
		this.isCancel = false;
		this.onChooseItem(value.item, evt);
		this.close();
	}

	onChooseItem(item: SuggestModel, evt: MouseEvent | KeyboardEvent): void {
		if (typeof item === "string") {
			this.onChoose(item, evt);
		} else {
			this.onChoose(item.value, evt);
		}
	}

	close(): void {
		if (this.isCancel) {
			this.onCancel?.();
		}
		super.close();
	}
}
