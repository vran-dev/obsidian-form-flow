import { FormScript } from "./FormScript";
import { FormScriptLoader } from "./FormScriptLoader";
import { FormScriptRunner } from "./FormScriptRunner";
import { App, EventRef, normalizePath, TAbstractFile, TFile } from "obsidian";


export class FormScriptService {

    private formScripts: Map<string, FormScript> = new Map();

    private formScriptLoader: FormScriptLoader = new FormScriptLoader();

    private eventRefs: EventRef[] = [];

    private extensionFolder: string;

    private app: App;

    getFunctions() {
        return Array.from(this.formScripts.values());
    }

    async run(expression: string, contextOptions: Record<string, any> = {}) {
        const functions = Array.from(this.formScripts.values())
        return FormScriptRunner.run(this.app, expression, functions, contextOptions);
    }

    async runWithFunctions(additionalFunctions: FormScript[], expression: string, contextOptions: Record<string, any> = {}) {
        const functions = Array.from(this.formScripts.values())
        const allExtensions = [
            ...functions,
            ...additionalFunctions
        ]
        return FormScriptRunner.run(this.app, expression, allExtensions, contextOptions);
    }

    async refresh(extensionFolder: string) {
        if (this.extensionFolder !== extensionFolder) {
            const folder = this.normalizeExtensionFolder(extensionFolder);
            this.extensionFolder = folder;
            const functions = await this.formScriptLoader.loadAll(this.app, this.extensionFolder);
            this.formScripts.clear();
            functions.forEach((extension) => {
                this.formScripts.set(extension.id, extension);
            });
        }
    }

    unload() {
        const app = this.app;
        this.eventRefs.forEach(ref => {
            app.vault.offref(ref);
        });
    }

    async initialize(app: App, scriptFolder: string) {
        this.app = app;
        this.extensionFolder = this.normalizeExtensionFolder(scriptFolder);

        const functions = await this.formScriptLoader.loadAll(app, this.extensionFolder);
        this.formScripts.clear();
        functions.forEach((extension) => {
            this.formScripts.set(extension.id, extension);
        });
        this.watchFolder();
        // console.info("script extension loaded " + this.formScripts.size + " functions from " + this.extensionFolder, this.formScripts);
    }

    private watchFolder() {
        const app = this.app;
        const createFileEventRef = app.vault.on("create", async (file: TFile) => {
            if (this.isExtensionFile(file)) {
                // console.info("script extension created " + file.path)
                const extension = await this.formScriptLoader.load(app, file);
                if (extension) {
                    this.formScripts.set(file.path, extension);
                }
            }
        });

        // delete file
        const deleteFileEventRef = app.vault.on("delete", (file: TFile) => {
            if (this.isExtensionFile(file)) {
                // console.info("script extension deleted " + file.path)
                this.formScripts.delete(file.path);
            }
        });

        // modify file
        const modifyFileEventRef = app.vault.on("modify", async (file: TFile) => {
            if (this.isExtensionFile(file)) {
                const extension = await this.formScriptLoader.load(app, file);
                // console.info("script extension modified " + file.path, extension)
                if (extension) {
                    this.formScripts.set(file.path, extension);
                }
            }
        })

        // rename file
        const renameFileEventRef = app.vault.on("rename", async (file: TFile, oldPath: string) => {
            if (this.isExtensionFile(file)) {
                // console.info("script extension renamed " + oldPath + " to " + file.path)
                this.formScripts.delete(oldPath);
                const extension = await this.formScriptLoader.load(app, file);
                if (extension) {
                    this.formScripts.set(file.path, extension);
                }
            }
        })
        this.eventRefs = [createFileEventRef, deleteFileEventRef, modifyFileEventRef, renameFileEventRef];
    }


    private normalizeExtensionFolder(scriptFolder: string) {
        const folder = scriptFolder || "";
        const normalizedFolder = normalizePath(folder);
        return normalizedFolder;
    }

    private isExtensionFile(file: TAbstractFile) {
        if (file instanceof TFile) {
            const folder = this.extensionFolder || "";
            const isExtensionFile = file.path.startsWith(folder) && file.extension === "js";
            return isExtensionFile;
        }
        return false;
    }

    getExtensionFolder() {
        return this.extensionFolder;
    }
}

export const formScriptService = new FormScriptService();