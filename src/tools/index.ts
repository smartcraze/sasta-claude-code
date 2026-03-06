import { type FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { 
    readFile, 
    writeFile, 
    listFiles as listFilesImpl, 
    searchFiles as searchFilesImpl,
    moveFile,
    copyFile,
    deleteFile,
    makeDir,
    deleteDir,
    getFileInfo,
    grepFiles as grepFilesImpl
} from './fs.ts';
import { runCommand as runCommandImpl } from './exec.ts';

/**
 * Tool definitions aligned with Google Generative AI's FunctionDeclaration schema.
 */

// Define explicit type for tool definition
interface ToolDefinition {
    name: string;
    description: string;
    functionDeclarations: FunctionDeclaration[];
    execute: (args: any) => Promise<string>;
}

export const tools: ToolDefinition[] = [
  {
    name: 'read_file',
    description: 'Reads the content of a file. Use this to read source code or text files.',
    functionDeclarations: [{
      name: 'read_file',
      description: 'Reads the content of a file.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          filePath: { type: SchemaType.STRING, description: 'The path to the file to read.' },
        },
        required: ['filePath'],
      },
    }],
    execute: async ({ filePath }: { filePath: string }) => {
      return await readFile(filePath);
    },
  },
  {
    name: 'write_file',
    description: 'Writes content to a file. Overwrites existing content. Creates directories if needed.',
    functionDeclarations: [{
      name: 'write_file',
      description: 'Writes content to a file.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          filePath: { type: SchemaType.STRING, description: 'The path to the file to write.' },
          content: { type: SchemaType.STRING, description: 'The content to write into the file.' },
        },
        required: ['filePath', 'content'],
      },
    }],
    execute: async ({ filePath, content }: { filePath: string, content: string }) => {
      return await writeFile(filePath, content);
    },
  },
  {
      name: 'move_file',
      description: 'Moves or renames a file or directory.',
      functionDeclarations: [{
          name: 'move_file',
          description: 'Moves or renames a file or directory.',
          parameters: {
              type: SchemaType.OBJECT,
              properties: {
                  source: { type: SchemaType.STRING, description: 'The source path.' },
                  destination: { type: SchemaType.STRING, description: 'The destination path.' },
              },
              required: ['source', 'destination'],
          },
      }],
      execute: async ({ source, destination }: { source: string, destination: string }) => {
          return await moveFile(source, destination);
      },
  },
  {
      name: 'copy_file',
      description: 'Copies a file.',
      functionDeclarations: [{
          name: 'copy_file',
          description: 'Copies a file.',
          parameters: {
              type: SchemaType.OBJECT,
              properties: {
                  source: { type: SchemaType.STRING, description: 'The source path.' },
                  destination: { type: SchemaType.STRING, description: 'The destination path.' },
              },
              required: ['source', 'destination'],
          },
      }],
      execute: async ({ source, destination }: { source: string, destination: string }) => {
          return await copyFile(source, destination);
      },
  },
  {
      name: 'make_directory',
      description: 'Creates a new directory (recursive).',
      functionDeclarations: [{
          name: 'make_directory',
          description: 'Creates a new directory (recursive).',
          parameters: {
              type: SchemaType.OBJECT,
              properties: {
                  dirPath: { type: SchemaType.STRING, description: 'The path to create.' },
              },
              required: ['dirPath'],
          },
      }],
      execute: async ({ dirPath }: { dirPath: string }) => {
          return await makeDir(dirPath);
      },
  },
  {
      name: 'delete_file',
      description: 'Deletes a single file.',
      functionDeclarations: [{
          name: 'delete_file',
          description: 'Deletes a single file.',
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
  },
  {
      name: 'delete_directory',
      description: 'Deletes a directory recursively.',
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
  },
  {
      name: 'get_file_info',
      description: 'Gets information about a file or directory.',
      functionDeclarations: [{
          name: 'get_file_info',
          description: 'Gets information about a file or directory (size, created/modified time, etc).',
          parameters: {
              type: SchemaType.OBJECT,
              properties: {
                  filePath: { type: SchemaType.STRING, description: 'The path to check.' },
              },
              required: ['filePath'],
          },
      }],
      execute: async ({ filePath }: { filePath: string }) => {
          return await getFileInfo(filePath);
      },
  },
  {
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
      return await listFilesImpl(dirPath);
    },
  },
  {
    name: 'file_search',
    description: 'Recursively searches for files matching a name pattern.',
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
      return await searchFilesImpl(rootPath, pattern);
    },
  },
  {
    name: 'grep_search',
    description: 'Searches for a string pattern (or regex) within file contents in a directory.',
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
      return await grepFilesImpl(rootPath, pattern);
    },
  },
  {
    name: 'run_command',
    description: 'Runs a shell command.',
    functionDeclarations: [{
      name: 'run_command',
      description: 'Runs a shell command and returns output.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          command: { type: SchemaType.STRING, description: 'The shell command to run.' },
        },
        required: ['command'],
      },
    }],
    execute: async ({ command }: { command: string }) => {
      return await runCommandImpl(command);
    },
  },
];

export const getToolFunctions = (): FunctionDeclaration[] => {
    return tools.flatMap(t => t.functionDeclarations);
}

export const executeTool = async (name: string, args: any) => {
    const tool = tools.find(t => t.functionDeclarations.some(fd => fd.name === name));
    if (!tool) throw new Error(`Tool ${name} not found`);
    return await tool.execute(args);
}