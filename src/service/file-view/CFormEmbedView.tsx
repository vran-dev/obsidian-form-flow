import { App, Component, TFile } from "obsidian";
import { EmbedContext } from "obsidian-typings";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import CalloutBlock from "src/component/callout-block/CalloutBlock";
import { ObsidianAppContext } from "src/context/obsidianAppContext";
import { FormConfig } from "src/model/FormConfig";
import { CpsFormFileView } from "src/view/preview/CpsFormFileView";

export class CFormEmbedView extends Component {
	containerEl: HTMLElement;
	root: Root;

	constructor(
		public info: EmbedContext,
		public file: TFile,
		public subpath: string,
		public app: App
	) {
		super();
		this.containerEl = info.containerEl;
		this.containerEl.addClasses(["form--embed-view"]);
		this.root = createRoot(this.containerEl);
	}

	override onload(): void {
		super.onload();
		this.render();
	}

	override onunload(): void {
		super.onunload();
		setTimeout(() => {
			this.root?.unmount();
			this.containerEl.empty();
		});
	}

	async loadFile() {
		// TODO we can do render at here?
	}

	async render() {
		const app = this.app;
		const data = await app.vault.cachedRead(this.file);
		const formConfig = JSON.parse(data) as FormConfig;
		this.containerEl.addClass("form--contains-initial");
		try {
			this.root.render(
				<StrictMode>
					<ObsidianAppContext.Provider value={app}>
						<div
							onClick={(e) => {
								e.nativeEvent.stopImmediatePropagation();
							}}
						>
							<CpsFormFileView
								filePath={this.file.path}
								formConfig={formConfig}
							/>
						</div>
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
