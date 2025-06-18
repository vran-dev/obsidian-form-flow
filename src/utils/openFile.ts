import { App, TFile, Platform } from "obsidian";
import { FileModalWindow } from "src/component/modal/FileModalWIndow";

export function openFile(
    app: App,
    evt: React.MouseEvent | MouseEvent | null,
    file: TFile,
    openState?: {
        openType?:
        | boolean
        | "tab"
        | "split"
        | "window"
        | "modal"
        | "current"
        | "none";
        linkText?: string;
    }
) {
    // ctrl + click \ command + click \ middle mouse button
    const newTabKey = evt?.ctrlKey || evt?.metaKey || evt?.button === 1;
    const source = app.workspace.getActiveFile()?.path || "";
    const openType = openState?.openType;
    if (openType === "none") {
        return;
    }
    const currentView = app.workspace.getActiveFileView();

    const currentLeaf = currentView?.leaf;
    let isPinned = false;
    if (currentLeaf) {
        const state = currentLeaf.getViewState();
        isPinned = state.pinned || false;
    }

    // force use modal if modal exists
    if (FileModalWindow.modal) {
        FileModalWindow.open(app, file);
        return;
    }

    if (openType === "modal" && !newTabKey) {
        FileModalWindow.open(app, file);
        return;
    }
    const linkText = openState?.linkText || file.path;
    if (Platform.isDesktop) {
        // if is new window
        if (openType === "window") {
            app.workspace.openLinkText(linkText, source, openType);
            return;
        }

        if (openType == "current" || isPinned) {
            app.workspace.openLinkText(linkText, source, newTabKey);
        } else {
            app.workspace.openLinkText(
                linkText,
                source,
                // @ts-ignore
                openType || newTabKey
            );
        }
    } else {
        app.workspace.openLinkText(
            linkText,
            source,
            openType !== "current" || newTabKey
        );
    }
}