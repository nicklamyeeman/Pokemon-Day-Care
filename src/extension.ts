import * as vscode from 'vscode';
import { DayCare } from './day_care/DayCare';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pokemon-day-care" is now active!');

	let dayCare = new DayCare(context.globalState.get('dayCare'));

    vscode.commands.registerCommand('type', (args) => {
        dayCare.addExperience();
        context.globalState.update('dayCare', dayCare);
		vscode.window.showInformationMessage('experience = ' + dayCare._experience);
        return vscode.commands.executeCommand('default:type', args);
    });
}

export function deactivate() {}
