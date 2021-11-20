// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Remify" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('remify.remify', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const regex = /\-?\d{1,4}(?:\.\d{1,4})?px/g; // Find all instances of positive/negative px
			let numberOfMatchs = 0;
			const formattedPage = document.getText().replaceAll(regex, (match) => {
				const numericValue = match.replace(/[^\d.-]/g, ''); // Find numeric value specific to px match
				if (parseInt(numericValue) > -10 && parseInt(numericValue) < 10) {
					return match;
				} else {
					numberOfMatchs++;
					const remFormat = `rem(${numericValue})`;
					return remFormat;
				}
			});

			const firstLine = document.lineAt(0);
			const lastLine = document.lineAt(document.lineCount - 1);
			const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

			editor
				.edit((editBuilder) => editBuilder.replace(textRange, formattedPage))
				.then((success) => {
					if (success) {
						const position = editor.selection.end;
						editor.selection = new vscode.Selection(position, position);
					}
				});
			vscode.window.showInformationMessage(
				`${numberOfMatchs} instance${numberOfMatchs > 1 ? 's' : ''} of px updated to rem()`
			);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
