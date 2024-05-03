import { commands, ExtensionContext, window } from "vscode";
import { ComponentGalleryPanel } from "./panels/ComponentGalleryPanel";
import { findFunctionDeclarations } from "./utils";

export function activate(context: ExtensionContext) {
  // Create the show gallery command
  const run = commands.registerCommand("sysobs.run", () => {
    ComponentGalleryPanel.render(context.extensionUri);
  });

  const scan = commands.registerCommand("sysobs.scan", function () {
    const editor = window.activeTextEditor;

    if (editor) {
      let document = editor.document;

      const documentText = document.getText();

      const extractedFunctions = findFunctionDeclarations(documentText);

      const panel = ComponentGalleryPanel.getCurrentPanel();

      panel?.webview.postMessage({
        command: "onScanData",
        extractedFunctions,
      });
    }
  });

  context.subscriptions.push(run, scan);
}
