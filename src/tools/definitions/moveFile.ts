import { SchemaType } from '@google/generative-ai';
import { moveFile } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const moveFileTool: ToolDefinition = {
    name: 'move_file',
    description: 'Moves or renames a file.',
    functionDeclarations: [{
        name: 'move_file',
        description: 'Moves a file from source to destination.',
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
        return await moveFile(source, destination);
    },
};
