const vscode = require('vscode');

function activate(context) {
    console.log('Extension "your-extension-name" is now active!');

    let disposable = vscode.commands.registerCommand('test.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from your-extension-name!');
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};