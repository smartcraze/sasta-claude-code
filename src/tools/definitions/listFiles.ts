import { SchemaType } from '@google/generative-ai';
import { listFiles } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const listFilesTool: ToolDefinition = {
    name: 'list_files',
    description: 'Lists files in a directory.',
    functionDeclarations: [{
       name: 'list_files',
       description: 'Lists files in a directory.',
       parameters: {
         type: SchemaType.OBJECT,
         properties: {
           dirPath: { type: SchemaType.STRING, description: 'The path to the directory to list.' },
         },
         required: ['dirPath'],
       },
    }],
    execute: async ({ dirPath }: { dirPath: string }) => {
      return await listFiles(dirPath);
    },
};
