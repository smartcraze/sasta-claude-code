import { SchemaType } from '@google/generative-ai';
import { writeFile } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const writeFileTool: ToolDefinition = {
    name: 'write_file',
    description: 'Writes content to a file.',
    functionDeclarations: [{
        name: 'write_file',
        description: 'Writes the content to a file, overwriting if it exists.',
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                filePath: { type: SchemaType.STRING, description: 'The file path.' },
                content: { type: SchemaType.STRING, description: 'The content to write.' },
            },
            required: ['filePath', 'content'],
        },
    }],
    execute: async ({ filePath, content }: { filePath: string, content: string }) => {
        return await writeFile(filePath, content);
    },
};
