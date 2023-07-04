import * as vscode from 'vscode';
import { DayCare } from './daycare/DayCare';
import { Pokedex } from './daycare/utils/Pokedex';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pokemon-day-care" is now active!');

    context.globalState.update('dayCare', null);
	let dayCare = new DayCare(context.globalState.get('dayCare'));
    const pokedex = new Pokedex();

    vscode.commands.registerCommand('type', (args) => {
        dayCare.addExperience();
        context.globalState.update('dayCare', dayCare);
		vscode.window.showInformationMessage('experience = ' + dayCare._totalExperience);
        return vscode.commands.executeCommand('default:type', args);
    });
}

export function deactivate() {}
