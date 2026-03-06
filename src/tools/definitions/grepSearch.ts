import { SchemaType } from '@google/generative-ai';
import { grepFiles } from '../fs.ts';
import type { ToolDefinition } from './types.ts';

export const grepSearchTool: ToolDefinition = {
    name: 'grep_search',
    description: 'Searches for text content within files.',
    functionDeclarations: [{
       name: 'grep_search',
       description: 'Searches for a string pattern (or regex) within file contents in a directory.',
       parameters: {
         type: SchemaType.OBJECT,
         properties: {
           rootPath: { type: SchemaType.STRING, description: 'The directory to start searching from (e.g. "./src").' },
           pattern: { type: SchemaType.STRING, description: 'The text to search for. Wrap in slashes for regex (e.g. "/^import/").' },
         },
         required: ['rootPath', 'pattern'],
       },
    }],
    execute: async ({ rootPath, pattern }: { rootPath: string, pattern: string }) => {
      return await grepFiles(rootPath, pattern);
    },
};
