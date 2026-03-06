import { SchemaType } from '@google/generative-ai';
import { searchFiles } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const fileSearchTool: ToolDefinition = {
    name: 'file_search',
    description: 'Recursively searches for files by name.',
    functionDeclarations: [{
       name: 'file_search',
       description: 'Recursively searches for files matching a name pattern starting from a root path.',
       parameters: {
         type: SchemaType.OBJECT,
         properties: {
           rootPath: { type: SchemaType.STRING, description: 'The directory to start searching from (e.g. "./src").' },
           pattern: { type: SchemaType.STRING, description: 'The string pattern to match in filenames (e.g. ".ts").' },
         },
         required: ['rootPath', 'pattern'],
       },
    }],
    execute: async ({ rootPath, pattern }: { rootPath: string, pattern: string }) => {
      return await searchFiles(rootPath, pattern);
    },
};
