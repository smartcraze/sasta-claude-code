import { readFileTool } from './definitions/readFile.ts';
import { writeFileTool } from './definitions/writeFile.ts';
import { listFilesTool } from './definitions/listFiles.ts';
import { fileSearchTool } from './definitions/fileSearch.ts';
import { grepSearchTool } from './definitions/grepSearch.ts';
import { moveFileTool } from './definitions/moveFile.ts';
import { copyFileTool } from './definitions/copyFile.ts';
import { deleteFileTool } from './definitions/deleteFile.ts';
import { makeDirTool } from './definitions/makeDir.ts';
import { deleteDirTool } from './definitions/deleteDir.ts';
import { getFileInfoTool } from './definitions/getFileInfo.ts';
import { runCommandTool } from './definitions/runCommand.ts';
import type { ToolDefinition } from './definitions/types.ts';

const toolDefinitions: ToolDefinition[] = [
    readFileTool,
    writeFileTool,
    listFilesTool,
    fileSearchTool,
    grepSearchTool,
    moveFileTool,
    copyFileTool,
    deleteFileTool,
    makeDirTool,
    deleteDirTool,
    getFileInfoTool,
    runCommandTool,
];

export const getToolFunctions = () => {
    return toolDefinitions.flatMap(toolDescription => toolDescription.functionDeclarations);
};

export const executeTool = async (name: string, args: any) => {
    const tool = toolDefinitions.find(t => t.functionDeclarations.some(fd => fd.name === name));
    if (!tool) {
        throw new Error(`Tool ${name} not found`);
    }
    return await tool.execute(args);
};
