import { App, Modal } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { CreateFileForm } from "./CreateFileForm";
import { ObsidianAppContext } from "src/context/obsidianAppContext";

type Options = {
	title?: string;
	fileType: string;
	defaultFilebasename?: string;
	defaultTargetFolder?: string;
	onSubmit: (fileName: string, targetFolder: string) => Promise<void>;
};

export class CreateFileModal extends Modal {
	root: Root | null;

	constructor(public app: App, public options: Options) {
		super(app);
		if (options.title) {
			this.setTitle(options.title);
		}
	}

	onOpen(): void {
		this.containerEl.addClass("form--CreateFileFormModal");
		this.root = createRoot(this.contentEl);
		const app = this.app;
		const opt = this.options;
		this.root.render(
			<StrictMode>
				<ObsidianAppContext.Provider value={app}>
					<CreateFileForm
						fileType={opt.fileType}
						defaultBasename={opt.defaultFilebasename}
						defaultTargetFolder={opt.defaultTargetFolder}
						onSubmit={async (fileName, folder) => {
							await opt.onSubmit(fileName, folder);
						}}
						onCancel={() => {
							this.close();
						}}
					/>
				</ObsidianAppContext.Provider>
			</StrictMode>
		);
	}

	onClose(): void {
		super.onClose();
		setTimeout(() => {
			this.root?.unmount();
			this.contentEl.empty();
		});
	}
}
