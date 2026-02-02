import * as vscode from 'vscode';
import { listContainers } from '../cli/container';
import { Container } from '../models/container';

export class ContainersTreeProvider
  implements vscode.TreeDataProvider<ContainerItem> {

  private _onDidChangeTreeData =
    new vscode.EventEmitter<ContainerItem | undefined>();

  readonly onDidChangeTreeData =
    this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: ContainerItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<ContainerItem[]> {
    const containers = await listContainers();
    return containers.map(
      c => new ContainerItem(c)
    );
  }
}

class ContainerItem extends vscode.TreeItem {
  constructor(public container: Container) {
    super(
      container.image || container.id,
      vscode.TreeItemCollapsibleState.None
    );

    this.description = container.state;
    this.tooltip = `ID: ${container.id}`;

    this.iconPath =
      container.state === 'running'
        ? new vscode.ThemeIcon('play-circle')
        : new vscode.ThemeIcon('circle-outline');
  }
}
