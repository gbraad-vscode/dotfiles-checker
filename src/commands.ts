import { Log } from './utils';
import { runInTerminal } from './terminal';

export async function runDotfilesUpdate() {
    let command = `dotfiles update`;
    Log.info('Running command: ' + command);
    runInTerminal(command);
}

export async function runDotfilesSwitch() {
    let command = `dotfiles switch`;
    Log.info('Running command: ' + command);
    runInTerminal(command);
}