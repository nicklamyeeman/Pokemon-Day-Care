import * as vscode from 'vscode';
import { DayCare } from './daycare/DayCare';
import { ColorsViewProvider } from './provider/ColorsViewProvider';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pokemon-daycare" is now active!');

    context.globalState.update('daycare', null);
	let daycare = new DayCare(context.globalState.get('daycare'));

    const provider = new ColorsViewProvider(context.extensionUri, daycare);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));

    vscode.commands.registerCommand('type', async (args) => {
        await daycare.tick();
        context.globalState.update('daycare', daycare);
        provider.updateDaycare(daycare)
        return vscode.commands.executeCommand('default:type', args);
    });
}

export function deactivate() {}
