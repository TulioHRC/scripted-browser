const vscode = require('vscode');

function activate(context) {
    console.log('Extension "scripted-browser" is now active!');

    const helloWorldCommand = vscode.commands.registerCommand('scripted-browser.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from "scripted-browser"!');
    });

    const scriptedTabCommand = vscode.commands.registerCommand('scripted-browser.scripted-tab', async () => {
        const config = vscode.workspace.getConfiguration('scripted-browser');
        const scripts = config.get('scripts', []);

        if (scripts.length === 0) {
            vscode.window.showErrorMessage('No custom commands defined. Please configure them in settings.');
            return;
        }

        const selectedScript = scripts.length === 1 ? scripts[0].name : 
            await vscode.window.showQuickPick(scripts.map(script => script.name), {
                placeHolder: 'Select a command to run'
            });

        if (selectedScript) {
            const script = scripts.find(s => s.name === selectedScript);

            if (script) {
                if (script.script) {
                    runScriptInTerminal(script.script);
                }

                if (script.url) {
                    openUrlInWebview(script.url, script.isSidePanel);
                }
            }
        }
    });

    context.subscriptions.push(helloWorldCommand, scriptedTabCommand);
}

function deactivate() { };

function runScriptInTerminal(script) {
    const terminal = vscode.window.createTerminal('Custom Command');
    terminal.show();
    terminal.sendText(script);
}

function openUrlInWebview(url, isSidePanel) {
    const panel = vscode.window.createWebviewPanel(
        'webview',
        'Webview',
        isSidePanel === true ? vscode.ViewColumn.Beside : vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Webview</title>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                #reload-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 1000;
                    padding: 5px 10px;
                    font-size: 14px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                }
                #reload-button:hover {
                    background-color: rgba(255, 255, 255, 1);
                }
            </style>
        </head>
        <body>
            <iframe id="webview-frame" src="${url}"></iframe>
            <button id="reload-button">Reload</button>
            <script>
                const reloadButton = document.getElementById('reload-button');
                const webviewFrame = document.getElementById('webview-frame');

                reloadButton.addEventListener('click', () => {
                    webviewFrame.src = webviewFrame.src; // Reload the iframe
                });
            </script>
        </body>
        </html>
    `;
}

module.exports = {
    activate,
    deactivate
};