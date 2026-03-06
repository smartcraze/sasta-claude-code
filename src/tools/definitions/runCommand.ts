import { SchemaType } from '@google/generative-ai';
import { runCommand } from '../exec.ts';
import type { ToolDefinition } from './types.ts';

export const runCommandTool: ToolDefinition = {
    name: 'run_command',
    description: 'Runs a shell command.',
    functionDeclarations: [{
      name: 'run_command',
      description: 'Runs a shell command and returns output.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          command: { type: SchemaType.STRING, description: 'The shell command to run.' },
        },
        required: ['command'],
      },
    }],
    execute: async ({ command }: { command: string }) => {
      return await runCommand(command);
    },
};
