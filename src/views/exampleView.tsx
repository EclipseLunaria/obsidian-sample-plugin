import { StrictMode } from "react";
import React from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import {ExampleComponent} from "../components/example";
import { createContext } from "react";
import { App } from "obsidian";

const AppContext = createContext<App | null>(null);
export const VIEW_TYPE_EXAMPLE = "example-view";



export class ExampleView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
      super(leaf);
    }

    getViewType() {
      return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
      return "Example view";
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
          <AppContext.Provider value={this.app}>
            <StrictMode>
                <ExampleComponent />
            </StrictMode>
          </AppContext.Provider>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}

// export default {ExampleView, VIEW_TYPE_EXAMPLE};