import { Plugin, WorkspaceLeaf } from "obsidian";
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./views/exampleView";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';
export default class ExamplePlugin extends Plugin {
  serverProcess: ChildProcessWithoutNullStreams;
  async onload() {
    const basePath = (this.app.vault.adapter as any).basePath.replace(" ", "%20");
    console.log("loading plugin");
    console.log(basePath);
    this.startServer();
    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon("list", "Configure Readme's", () => {
      this.activateView();
    });
  }

  async onunload() {
  this.serverProcess.kill();
}

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
    }

    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
      // "Reveal" the leaf in case it is in a collapsed sidebar
      workspace.revealLeaf(leaf);
    }
      }
      startServer() {
        const basePath = (this.app.vault.adapter as any).basePath;
        console.log(basePath);
        // console.log(path.join(basePath ,".obsidian", "plugins", this.manifest.id, 'src', 'server', 'server.py'));
        const serverPath = path.join(basePath ,".obsidian", "plugins", this.manifest.id, 'src', 'server', 'server.py');
        this.serverProcess = spawn('python', [serverPath]);

        this.serverProcess.stdout.on('data', (data:any) => {
            console.log(`Server: ${data}`);
        });

        this.serverProcess.stderr.on('data', (data:any) => {
            console.error(`Server error: ${data}`);
        });

        this.serverProcess.on('close', (code:any) => {
            console.log(`Server exited with code ${code}`);
        });
    }
}
