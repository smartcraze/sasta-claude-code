import { SchemaType } from '@google/generative-ai';
import { readFile } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const readFileTool: ToolDefinition = {
    name: 'read_file',
    description: 'Reads the content of a file.',
    functionDeclarations: [{
        name: 'read_file',
        description: 'Reads the content of a file.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                filePath: { type: SchemaType.STRING, description: 'The path to the file to read.' },
            },
            required: ['filePath'],
        },
    }],
    execute: async ({ filePath }: { filePath: string }) => {
        return await readFile(filePath);
    },
};
