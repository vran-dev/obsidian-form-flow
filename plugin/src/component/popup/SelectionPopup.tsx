import { createRoot, Root } from "react-dom/client";
import PopupEl from "./PopupEl";
import "./SelectionPopup.css";
import { Copy } from "lucide-react";
import { Notice } from "obsidian";
import { localInstance } from "src/i18n/locals";

export class PupupOptions {
	asMarkdown?: boolean;
}

export class SelectionPopup {
	private root: Root | null = null;
	private container: HTMLElement | null = null;

	constructor(content: string) {
		this.container = document.createElement("div");
		this.container.className = "form--SelectionPopup";
		document.body.appendChild(this.container);
		this.root = createRoot(this.container);
		this.render(content);
	}

	update(message: string): void {
		if (this.root && this.container) {
			this.render(message);
		}
	}

	private render(message: string) {
		if (this.root) {
			const selection = window.getSelection();
			const range =
				typeof selection?.rangeCount === "number" &&
				selection.rangeCount > 0
					? selection.getRangeAt(0)
					: null;

			if (selection?.isCollapsed) {
				return;
			}

			if (range) {
				const reference = {
					getBoundingClientRect: () => range.getBoundingClientRect(),
					getClientRects: () => range.getClientRects(),
				};
				this.root.render(
					<PopupEl
						open={true}
						reference={reference}
						onClose={() => {
							this.close();
						}}
					>
						<button
							className="form--SelectionPopupCopyButton"
							aria-label={localInstance.copy}
							onClick={(e) => {
								e.stopPropagation();
								navigator.clipboard.writeText(message);
								new Notice(localInstance.copy_success);
							}}
						>
							<Copy size={14} />
						</button>
						<div className="form--SelectionPopupContent">
							{message}
						</div>
					</PopupEl>
				);
			}
		}
	}

	close() {
		setTimeout(() => {
			if (this.root) {
				this.root.unmount();
				this.root = null;
			}
			if (this.container) {
				this.container.remove();
				this.container = null;
			}
		}, 50);
	}

	static show() {}
}
