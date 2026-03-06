import { SchemaType } from '@google/generative-ai';
import { deleteDir } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const deleteDirTool: ToolDefinition = {
    name: 'delete_directory',
    description: 'Deletes a directory.',
    functionDeclarations: [{
        name: 'delete_directory',
        description: 'Deletes a directory recursively.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                dirPath: { type: SchemaType.STRING, description: 'The path to the directory to delete.' },
            },
            required: ['dirPath'],
        },
    }],
    execute: async ({ dirPath }: { dirPath: string }) => {
        return await deleteDir(dirPath);
    },
};
