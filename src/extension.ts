import * as vscode from 'vscode';
import {
  runContainerCommand,
  ContainerError
} from './cli/container';

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
        if (err instanceof ContainerError) {
          switch (err.type) {
            case 'CLI_NOT_FOUND':
              vscode.window.showErrorMessage(
                'Apple Container CLI not found. Please install it first.'
              );
              break;

            case 'SYSTEM_NOT_RUNNING':
              vscode.window.showWarningMessage(
                'Container system is not running.',
                'Start System'
              ).then(selection => {
                if (selection === 'Start System') {
                  vscode.commands.executeCommand(
                    'apple-container.startSystem'
                  );
                }
              });
              break;

            default:
              output.appendLine(`Error:\n${err.message}`);
          }
        } else {
          output.appendLine(`Unexpected error:\n${String(err)}`);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
  
  const startSystem = vscode.commands.registerCommand(
    'apple-container.startSystem',
    async () => {
      const output = vscode.window.createOutputChannel('Apple Container');
      output.show();
      output.appendLine('Starting container system...\n');

      try {
        const result = await runContainerCommand(['system', 'start']);
        output.appendLine(result || 'Container system started.');
        vscode.window.showInformationMessage(
          'Container system started successfully.'
        );
      } catch (err) {
        if (err instanceof ContainerError) {
          output.appendLine(`Error:\n${err.message}`);
        } else {
          output.appendLine(`Unexpected error:\n${String(err)}`);
        }
      }
    }
  );

  context.subscriptions.push(startSystem);

}

export function deactivate() {}
