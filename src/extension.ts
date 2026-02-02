import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'apple-container.listContainers',
    () => {
      const output = vscode.window.createOutputChannel('Apple Container');
      output.show();
      output.appendLine('Running: container list...\n');

      exec('container list', (error, stdout, stderr) => {
        if (error) {
          output.appendLine(`Error:\n${stderr || error.message}`);
          return;
        }
        output.appendLine(stdout || 'No containers found.');
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
