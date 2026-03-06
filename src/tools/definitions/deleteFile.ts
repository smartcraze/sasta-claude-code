import { SchemaType } from '@google/generative-ai';
import { deleteFile } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const deleteFileTool: ToolDefinition = {
    name: 'delete_file',
    description: 'Deletes a file.',
    functionDeclarations: [{
        name: 'delete_file',
        description: 'Deletes a file permanently.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                filePath: { type: SchemaType.STRING, description: 'The path to the file to delete.' },
            },
            required: ['filePath'],
        },
    }],
    execute: async ({ filePath }: { filePath: string }) => {
        return await deleteFile(filePath);
    },
};
