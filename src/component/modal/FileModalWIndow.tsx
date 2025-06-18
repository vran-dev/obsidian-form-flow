import {
	App,
	MarkdownView,
	Modal,
	Platform,
	Scope,
	setIcon,
	TFile,
	WorkspaceLeaf,
} from "obsidian";
import "./FileModalWindow.css";

export class FileModalWindow {
	static modal: FileModal | null;

	static open(app: App, file: TFile) {
		if (!this.modal) {
			this.modal = new FileModal(app, file, () => {
				FileModalWindow.close();
			});
			this.modal.open();
		} else {
			this.modal.openFile(file);
		}
	}

	static close() {
		this.modal = null;
	}
}

class FileModal extends Modal {
	private prevActiveLeaf: WorkspaceLeaf | null = null;
	private modalLeafRef: WorkspaceLeaf | null = null;
	private contentSourceLeafRef: WorkspaceLeaf | null = null;
	private closeByFullScreen = false;
	private file: TFile;
	private leafChangeListeners: (activeLeaf: WorkspaceLeaf | null) => void;
	private fileDeleteListener: (f: TFile) => void;
	private closeCallback: () => void;
	private handleKeyDown: (e: KeyboardEvent) => void;

	constructor(app: App, file: TFile, closeCallback: () => void) {
		super(app);
		this.handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "w") {
				e.stopImmediatePropagation();
				this.close();
			}
		};
		this.file = file;
		this.init();
		this.closeCallback = closeCallback;
	}

	init() {
		this.containerEl.style.zIndex = "var(--form-overlay-layer)";
		this.scope = new Scope(this.app.scope);
		this.addFullScreenButton();
		this.listenFileDelete();
		this.setupLinkClickHandler();
		this.leafChangeListeners = (activeLeaf: WorkspaceLeaf | null) => {
			if (activeLeaf) {
				const activeLeafFile = this.app.workspace.getActiveFile();
				if (activeLeafFile) {
					this.file = activeLeafFile;
					this.mountActiveLeafToModal(activeLeafFile);
				}
			}
		};
		window.addEventListener("keydown", this.handleKeyDown, true);
	}

	// 添加链接点击处理器
	private setupLinkClickHandler() {
		// 使用捕获阶段监听，并且监听整个容器
		this.containerEl.addEventListener(
			"click",
			(e: MouseEvent) => {
				// 检查是否按住了 Command 键
				if (e.metaKey || e.ctrlKey) {
					// 查找最近的链接元素 - 同时处理源码模式和实时预览模式
					const target = e.target as HTMLElement;
					const linkEl =
						target.closest("a.internal-link") ||
						target.closest(".cm-hmd-internal-link") ||
						target.closest(".cm-link");

					if (linkEl) {
						e.preventDefault();
						e.stopPropagation();
						e.stopImmediatePropagation();

						// 获取链接目标 - 根据不同的链接类型获取
						let href = linkEl.getAttribute("href");

						// 如果是 CodeMirror 链接元素，需要从文本内容中提取链接
						if (
							!href &&
							(linkEl.classList.contains(
								"cm-hmd-internal-link"
							) ||
								linkEl.classList.contains("cm-link"))
						) {
							href =
								linkEl.textContent?.replace(/[[\]]/g, "") ||
								"";
						}

						if (href) {
							// use modal to open file
							const targetFile =
								this.app.metadataCache.getFirstLinkpathDest(
									href,
									this.file.path
								);

							if (targetFile) {
								this.openFile(targetFile);
							}
						}
						return false;
					}
				}
			},
			true
		);
	}

	openFile(file: TFile) {
		this.file = file;
		this.mountActiveLeafToModal(file, true);
	}

	async onOpen() {
		this.modalEl.classList.add("form--FileModalWindow");

		// 使用推荐的方法获取当前活动叶子
		this.prevActiveLeaf = this.app.workspace.getMostRecentLeaf();

		// 创建一个隐藏的叶子用于模态窗口
		this.modalLeafRef = this.app.workspace.createLeafInParent(
			this.app.workspace.rootSplit,
			0
		);

		// 隐藏原始叶子的容器，但不从DOM中移除
		if (this.modalLeafRef && this.modalLeafRef.containerEl) {
			this.modalLeafRef.containerEl.style.display = "none";
		}

		await this.mountActiveLeafToModal(this.file);
		this.app.workspace.on("active-leaf-change", this.leafChangeListeners);
	}

	onClose() {
		window.removeEventListener("keydown", this.handleKeyDown, true);
		this.app.vault.off("delete", this.fileDeleteListener);
		this.app.workspace.off("active-leaf-change", this.leafChangeListeners);

		// reset prev actived
		if (this.prevActiveLeaf && !this.closeByFullScreen) {
			this.app.workspace.setActiveLeaf(this.prevActiveLeaf, {
				focus: true,
			});
		}

		if (this.modalLeafRef) {
			this.modalLeafRef.detach();
		}
		this.contentEl.empty();
		this.closeCallback();
	}

	private async mountActiveLeafToModal(file: TFile, force?: boolean) {
		this.contentEl.empty();
		const fileContainer = this.contentEl.createEl(
			"div",
			"form--FileModalWindowContainer"
		);
		fileContainer.setAttribute("data-src", this.file.path);

		if (!this.modalLeafRef) {
			return;
		}

		// make open mode consistent with default setting
		const defaultMode = this.app.vault.config?.defaultViewMode ?? "source";
		await this.modalLeafRef.openFile(file, {
			state: { mode: defaultMode },
		});
		this.contentSourceLeafRef = this.modalLeafRef;

		const view = this.contentSourceLeafRef.view;
		// fix history issue
		if (view instanceof MarkdownView) {
			const currentState = view.getState();
			view.setState(currentState, { history: false });
		}

		// 直接将原始视图容器移动到模态窗口，而不是克隆
		if (this.contentSourceLeafRef && this.contentSourceLeafRef.view) {
			fileContainer.appendChild(
				this.contentSourceLeafRef.view.containerEl
			);

			// 确保编辑器容器样式正确
			const editorContainer = fileContainer.querySelector(
				".markdown-source-view"
			);
			if (editorContainer) {
				(editorContainer as HTMLElement).style.height = "100%";
			}
		}

		// 设置活动叶子
		setTimeout(() => {
			if (this.modalLeafRef) {
				this.app.workspace.setActiveLeaf(this.modalLeafRef);
			}
		}, 10);
	}

	private addFullScreenButton() {
		if (Platform.isMobile) {
			return;
		}
		// add full screen button
		const fullScreenButton = this.modalEl.createEl(
			"div",
			"form--FileModalWindowFullScreenButton"
		);
		setIcon(fullScreenButton, "fullscreen");
		fullScreenButton.onclick = () => {
			if (this.modalLeafRef) {
				// 先移除事件监听，避免后续操作触发不必要的事件
				this.app.workspace.off(
					"active-leaf-change",
					this.leafChangeListeners
				);

				// 使用更可靠的方式在新标签页中打开文件
				// 使用 openLinkText 方法，确保文件在主界面正常打开
				const filePath = this.file.path;
				this.closeByFullScreen = true;
				// 关闭模态窗口
				this.close();

				// 在主界面打开文件
				setTimeout(() => {
					this.app.workspace.openLinkText(filePath, "", true);
				}, 50);
			}
		};
	}

	private listenFileDelete() {
		this.fileDeleteListener = (f: TFile) => {
			if (f.path === this.file.path) {
				this.close();
			}
		};
		this.app.vault.on("delete", this.fileDeleteListener);
	}
}
