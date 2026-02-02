import * as vscode from 'vscode';
import { runContainerCommand } from './cli/container';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'apple-container.listContainers',
    async () => {
      const output = vscode.window.createOutputChannel('Apple Container');
      output.show();
      output.appendLine('Running: container list...\n');

      try {
        const result = await runContainerCommand(['list']);
        output.appendLine(result || 'No containers found.');
      } catch (err) {
        output.appendLine(`Error:\n${String(err)}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
