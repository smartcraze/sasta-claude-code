import { SchemaType } from '@google/generative-ai';
import { makeDir } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const makeDirTool: ToolDefinition = {
    name: 'make_directory',
    description: 'Creates a directory.',
    functionDeclarations: [{
        name: 'make_directory',
        description: 'Creates a directory recursively.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                dirPath: { type: SchemaType.STRING, description: 'The path to the directory to create.' },
            },
            required: ['dirPath'],
        },
    }],
    execute: async ({ dirPath }: { dirPath: string }) => {
        return await makeDir(dirPath);
    },
};
