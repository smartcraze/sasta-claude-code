import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export const runCommand = async (command: string) => {
  try {
    // Increase maxBuffer to 10MB to avoid crashing on large outputs
    const { stdout, stderr } = await execAsync(command, { maxBuffer: 10 * 1024 * 1024 });
    return stdout || (stderr ? `Command output (stderr):\n${stderr}` : "Command executed successfully with no output.");
  } catch (error: any) {
    // Exec error contains stdout/stderr too usually
    const output = error.stdout ? `\nOutput:\n${error.stdout}` : '';
    const errOutput = error.stderr ? `\nError Output:\n${error.stderr}` : '';
    return `Command failed: ${error.message}${output}${errOutput}`;
  }
};
