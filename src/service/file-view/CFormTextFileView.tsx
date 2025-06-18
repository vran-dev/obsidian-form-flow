import { TFile, TextFileView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import CalloutBlock from "src/component/callout-block/CalloutBlock";
import { ObsidianAppContext } from "src/context/obsidianAppContext";
import { FormConfig } from "src/model/FormConfig";
import { CpsFormFileView } from "src/view/preview/CpsFormFileView";

export class CFormTextFileView extends TextFileView {
	static FORM_VIEW = "form-view";
	data: string;
	root: Root | null;
	file: TFile | null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.data = "";
		this.root = null;
	}

	async onOpen() {
		return super.onOpen();
	}

	protected onClose(): Promise<void> {
		if (this.root) {
			this.root.unmount();
			this.contentEl.empty();
		}
		return super.onClose();
	}

	onLoadFile(file: TFile): Promise<void> {
		this.file = file;
		return super.onLoadFile(file);
	}

	getViewData(): string {
		return this.data;
	}

	async setViewData(data: string, clear: boolean) {
		this.data = data;
		if (clear) {
			if (this.root) {
				this.root.unmount();
			}
			if (!this.file) {
				console.info("file not loaded...");
				return;
			}
			if (data === "{}" || data === "") {
				return;
			}
			// add class
			this.contentEl.addClass("form--FormTextFileView");
			this.root = createRoot(this.contentEl);
			const formConfig = JSON.parse(data) as FormConfig;
			try {
				this.root.render(
					<StrictMode>
						<ObsidianAppContext.Provider value={this.app}>
							<CpsFormFileView
								filePath={this.file.path}
								formConfig={formConfig}
							/>
						</ObsidianAppContext.Provider>
					</StrictMode>
				);
			} catch (e) {
				console.error(e);
				this.root.render(
					<StrictMode>
						<CalloutBlock type="error">{e.message}</CalloutBlock>
					</StrictMode>
				);
			}
		}
	}
	clear(): void {
		// this.data = "{}";
	}
	getViewType(): string {
		return CFormTextFileView.FORM_VIEW;
	}

	getDisplayText(): string {
		if (!this.file) {
			return "";
		}
		return this.file.basename;
	}

	getIcon(): string {
		return "gantt-chart";
	}
}
