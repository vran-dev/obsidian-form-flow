import { App } from "obsidian";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ObsidianAppContext } from "src/context/obsidianAppContext";
import { FormConfig } from "src/model/FormConfig";
import { CpsFormDataView } from "src/view/preview/CpsFormDataView";
import { CpsFormFileView } from "src/view/preview/CpsFormFileView";
import Dialog2 from "../dialog/Dialog2";
import "./FormViewModal.css";

export default class FormViewModal2 {
	private isOpen = false;
	private containerEl: HTMLElement | null = null;
	private source: {
		formFilePath?: string;
		formConfig?: FormConfig;
	};

	constructor(
		public app: App,
		source: {
			formFilePath?: string;
			formConfig?: FormConfig;
		}
	) {
		this.source = source;
	}

	async open() {
		if (this.isOpen) return;
		this.isOpen = true;

		// Create container element for the dialog
		this.containerEl = document.createElement("div");
		this.containerEl.className = "form--FormViewModal2Container";
		document.body.appendChild(this.containerEl);

		// Create React root
		const root = createRoot(this.containerEl);

		// Render the FormModalContent component
		root.render(
			<StrictMode>
				<FormModalContent
					app={this.app}
					source={this.source}
					onClose={() => {
						this.isOpen = false;
						setTimeout(() => {
							root.unmount();
							this.containerEl?.remove();
							this.containerEl = null;
						});
					}}
				/>
			</StrictMode>
		);
	}

	close() {
		this.isOpen = false;
		if (this.containerEl) {
			// Trigger React unmount through a state change in the component
			const event = new CustomEvent("formmodal-close");
			this.containerEl.dispatchEvent(event);
		}
	}
}

// React component for the modal content
function FormModalContent({
	app,
	source,
	onClose,
}: {
	app: App;
	source: {
		formFilePath?: string;
		formConfig?: FormConfig;
	};
	onClose: () => void;
}) {
	const [open, setOpen] = useState(true);
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [formConfig, setFormConfig] = useState<FormConfig | undefined>(
		source.formConfig
	);

	// Effect to handle closing
	useEffect(() => {
		if (!open) {
			onClose();
		}
	}, [open, onClose]);

	// Load form config from file if needed
	useEffect(() => {
		async function loadFormFromFile() {
			if (!source.formFilePath) return;

			try {
				const jsonObj = await app.vault.readJson(source.formFilePath);
				if (jsonObj) {
					const config = jsonObj as FormConfig;
					setFormConfig(config);

					// Set title based on file name
					const fileBaseName = source.formFilePath.split("/").pop();
					setTitle(fileBaseName);
				}
			} catch (error) {
				console.error("Failed to load form config", error);
			}
		}

		if (source.formFilePath && !formConfig) {
			loadFormFromFile();
		}
	}, [source.formFilePath, formConfig]);

	if (!formConfig && !source.formFilePath) {
		return null;
	}

	return (
		<Dialog2
			open={open}
			onOpenChange={setOpen}
			title={title}
			dialogClassName="form--CpsFormModal"
		>
			{(close) => (
				<ObsidianAppContext.Provider value={app}>
					{source.formFilePath && title && formConfig ? (
						<>
							<CpsFormFileView
								className="form--CpsFormModalContent"
								filePath={source.formFilePath}
								formConfig={formConfig}
								options={{
									hideHeader: true,
									showFilePath: true,
									afterSubmit: () => close(),
								}}
							/>
						</>
					) : formConfig ? (
						<CpsFormDataView
							className="form--CpsFormModalContent"
							formConfig={formConfig}
							options={{
								afterSubmit: () => close(),
							}}
						/>
					) : null}
				</ObsidianAppContext.Provider>
			)}
		</Dialog2>
	);
}
