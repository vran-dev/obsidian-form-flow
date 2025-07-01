import { App, Modal } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { ObsidianAppContext } from "src/context/obsidianAppContext";
import { IFormField } from "src/model/field/IFormField";
import { CpsFormRenderView } from "src/view/preview/CpsFormRenderView";

export default class extends Modal {
	root: Root | null;
	isCancel = true;

	constructor(
		public app: App,
		public fields: IFormField[],
		public onSubmit: (value: Record<string, any>) => void,
		public onCancel?: () => void
	) {
		super(app);
	}

	async onOpen() {
		this.renderFromObject();
	}
	private renderFromObject() {
		this.containerEl.addClass("form--CpsFormModal");
		this.root = createRoot(this.contentEl);

		const app = this.app;
		this.root.render(
			<StrictMode>
				<ObsidianAppContext.Provider value={app}>
					<CpsFormRenderView
						className="form--CpsFormModalContent"
						fields={this.fields}
						onSubmit={async (value: Record<string, any>) => {
							await this.onSubmit(value);
						}}
						afterSubmit={() => {
							this.isCancel = false;
							this.close();
						}}
					/>
				</ObsidianAppContext.Provider>
			</StrictMode>
		);
	}

	onClose(): void {
		super.onClose();
		if (this.isCancel && this.onCancel) {
			this.onCancel();
		}
		setTimeout(() => {
			this.root?.unmount();
			this.contentEl.empty();
		});
	}
}
