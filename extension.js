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
                    openUrlInWebview(script.url);
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

function openUrlInWebview(url) {
    const panel = vscode.window.createWebviewPanel(
        'webview',
        'Webview',
        vscode.ViewColumn.One,
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
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            </style>
        </head>
        <body>
            <iframe src="${url}"></iframe>
        </body>
        </html>
    `;
}

module.exports = {
    activate,
    deactivate
};