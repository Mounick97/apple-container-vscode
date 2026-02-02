import * as vscode from 'vscode';

export class DashboardViewProvider
  implements vscode.WebviewViewProvider {

  public static readonly viewType =
    'appleContainersDashboard';

  constructor(
    private readonly context: vscode.ExtensionContext
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView
  ) {
    webviewView.webview.options = {
      enableScripts: false
    };

    webviewView.webview.html = this.getHtml();
  }

  private getHtml(): string {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Apple Containers</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont,
                           "Segoe UI", sans-serif;
              padding: 16px;
              color: var(--vscode-foreground);
              background-color: var(--vscode-editor-background);
            }

            h1 {
              font-size: 1.4em;
              margin-bottom: 4px;
            }

            p {
              opacity: 0.8;
            }

            .card {
              border: 1px solid var(--vscode-editorWidget-border);
              border-radius: 6px;
              padding: 12px;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <h1>Apple Containers</h1>
          <p>Local container runtime</p>

          <div class="card">
            <strong>Dashboard</strong>
            <p>This dashboard will show system status and container summary.</p>
          </div>
        </body>
      </html>
    `;
  }
}
