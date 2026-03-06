// src/sdk/index.ts
import { type GenerativeModel } from '@google/generative-ai';
import { createLLMClient, startChat, type Message } from '../llm/gemini';
import { executeTool, getToolFunctions } from '../tools/index';

// Re-export core types
export type { ToolDefinition } from '../tools/definitions/types';
export type { Message } from '../llm/gemini';

/**
 * Configure the Sasta Claude AI SDK.
 */
export interface SDKConfig {
    apiKey: string;
    modelName?: string;
    systemInstruction?: string;
}

/**
 * Initialize the Sasta Claude Agent.
 */
export const createAgent = (config: SDKConfig) => {
    // Set environment variable fallback if needed for deeply nested tool logic
    if (!process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = config.apiKey;
    }
    if (config.modelName) {
        process.env.GEMINI_MODEL = config.modelName;
    }

    const model = createLLMClient(config.apiKey);
    const session = startChat(model);

    return {
        model,
        session,
        sendMessage: async (message: string) => {
            const result = await session.sendMessage(message);
            const response = result.response;
            return response;
        },
        executeTool: async (name: string, args: any) => {
            return await executeTool(name, args);
        },
        getTools: () => getToolFunctions(),
    };
};

export { executeTool, getToolFunctions };
