import { createContext, useContext } from "react";
import { App } from "obsidian";

export const ObsidianAppContext = createContext<App | undefined>(undefined);

export const useObsidianApp = (): App => {
	const app =  useContext(ObsidianAppContext);
    if (!app) {
        throw new Error("useObsidianApp must be used within a ObsidianAppContext");
    }
    return app;
};
