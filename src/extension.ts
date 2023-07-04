import * as vscode from 'vscode';
import { DayCare } from './daycare/DayCare';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pokemon-day-care" is now active!');

    context.globalState.update('dayCare', null);
	let dayCare = new DayCare(context.globalState.get('dayCare'));

    vscode.commands.registerCommand('type', (args) => {
        dayCare.tick();
        context.globalState.update('dayCare', dayCare);
        return vscode.commands.executeCommand('default:type', args);
    });
}

export function deactivate() {}
