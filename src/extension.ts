import * as vscode from 'vscode';
import {
  listContainers,
  runContainerCommand,
  ContainerError
} from './cli/container';
import { ContainersTreeProvider } from './tree/containersTreeProvider';

export function activate(context: vscode.ExtensionContext) {

  // Tree provider
  const containersTreeProvider = new ContainersTreeProvider();

  vscode.window.registerTreeDataProvider(
    'appleContainersView',
    containersTreeProvider
  );

  // Refresh command
  const refreshContainers = vscode.commands.registerCommand(
    'apple-container.refreshContainers',
    () => {
      containersTreeProvider.refresh();
    }
  );

  context.subscriptions.push(refreshContainers);

  // List containers command
  const listContainersCommand = vscode.commands.registerCommand(
    'apple-container.listContainers',
    async () => {
      const output = vscode.window.createOutputChannel('Apple Container');
      output.show();
      output.appendLine('Running: container list...\n');

      try {
        const containers = await listContainers();

        if (containers.length === 0) {
          output.appendLine('No containers found.');
          return;
        }

        containers.forEach(c => {
          output.appendLine(
            `${c.id}  ${c.image}  (${c.state})`
          );
        });

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

  context.subscriptions.push(listContainersCommand);

  // Start system command
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
