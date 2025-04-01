import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { Context, Log } from './utils';
import { runDotfilesUpdate, runDotfilesSwitch } from './commands';

export async function activate(context: vscode.ExtensionContext) {
    Log.info('Platform check starting');
    
    await Context.set(false);
    
    if (os.platform() !== 'linux') {
        Log.info(`Platform ${os.platform()} not supported, Linux required`);
        return;
    }

    const checkIfInstalled = async () => {
        try {
            const homeDir = process.env.HOME || process.env.USERPROFILE || '';
            const dotfilesDir = path.join(homeDir, '.dotfiles');
            const dotfilesConfigDir = path.join(homeDir, '.config', 'dotfiles');
            
            // The dotfiles configuration folder should always exist
            if (fs.existsSync(dotfilesConfigDir) && fs.existsSync(dotfilesDir)) {
                Log.info('Dotfiles already installed');
                await Context.set(true);
                return;
            } else
            {
                Log.info('Dotfiles not found, starting installation...');
                
                exec('curl -fsSL https://dotfiles.gbraad.nl/install.sh | bash', (error, stdout, stderr) => {
                    if (error) {
                        Log.info(`Installation failed with error: ${stderr}`);
                        Context.set(false);
                        return;
                    }
                    Log.info('Installation completed successfully');
                    Context.set(true);
                });
            }
        } catch (error) {
            Log.info(`Error checking installation status: ${error}`);
            await Context.set(false);
        }
    };

    await checkIfInstalled();

    context.subscriptions.push(vscode.commands.registerCommand('dotfiles-helper.runDotfilesUpdate', runDotfilesUpdate));
    context.subscriptions.push(vscode.commands.registerCommand('dotfiles-helper.runDotfilesSwitch', runDotfilesSwitch));
}

export function deactivate() {
    Log.info('Deactivating');
    Context.set(false);
    Log.dispose();
}