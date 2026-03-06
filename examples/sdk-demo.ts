// examples/sdk-demo.ts
import { createAgent } from '../src/sdk/index';
import { config } from 'dotenv';
config();

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Please set GEMINI_API_KEY environment variable.');
        process.exit(1);
    }

    const agent = createAgent({
        apiKey,
        modelName: 'gemini-2.0-flash',
    });

    console.log('🤖 Agent initialized. Sending message...');
    const response = await agent.sendMessage('Create a text file named "hello_sdk.txt" with content "Hello from SDK!"');
    
    console.log('📝 Response:', response.text());
}

if (import.meta.main) {
    main().catch(console.error);
}
