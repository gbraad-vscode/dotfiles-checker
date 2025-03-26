import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';;
    const dotfilesDir = path.join(homeDir, '.dotfiles');

    if (!fs.existsSync(dotfilesDir)) {
        vscode.window.showInformationMessage('Installing dotfiles...');
        exec('curl -fsSL https://dotfiles.gbraad.nl/install.sh | bash', (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error installing dotfiles: ${stderr}`);
                return;
            }
            vscode.window.showInformationMessage('Dotfiles installed successfully!');
        });
    } else {
        vscode.window.showInformationMessage('Dotfiles already installed.');
    }
}

export function deactivate() {}