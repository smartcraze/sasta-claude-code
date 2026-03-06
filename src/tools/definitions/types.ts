import { type FunctionDeclaration } from '@google/generative-ai';

export interface ToolDefinition {
    name: string;
    description: string;
    functionDeclarations: FunctionDeclaration[];
    execute: (args: any) => Promise<string>;
}
