import { SchemaType } from '@google/generative-ai';
import { getFileInfo } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const getFileInfoTool: ToolDefinition = {
    name: 'get_file_info',
    description: 'Gets file information.',
    functionDeclarations: [{
        name: 'get_file_info',
        description: 'Gets information about a file or directory (size, created/modified time, etc).',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                targetPath: { type: SchemaType.STRING, description: 'The path to the file or directory.' },
            },
            required: ['targetPath'],
        },
    }],
    execute: async ({ targetPath }: { targetPath: string }) => {
        return await getFileInfo(targetPath);
    },
};
