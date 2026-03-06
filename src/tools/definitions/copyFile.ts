import { SchemaType } from '@google/generative-ai';
import { copyFile } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const copyFileTool: ToolDefinition = {
    name: 'copy_file',
    description: 'Copies a file.',
    functionDeclarations: [{
        name: 'copy_file',
        description: 'Copies a file from source to destination.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                source: { type: SchemaType.STRING, description: 'The source file path.' },
                destination: { type: SchemaType.STRING, description: 'The destination file path.' },
            },
            required: ['source', 'destination'],
        },
    }],
    execute: async ({ source, destination }: { source: string, destination: string }) => {
        return await copyFile(source, destination);
    },
};
