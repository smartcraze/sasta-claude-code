# Sasta Claude (SDK & CLI)

A powerful, Gemini-powered coding assistant that you can use as a CLI tool or embed as an SDK in your own applications.

## 🚀 CLI Usage

### Installation

```bash
bun install
```

### Running

```bash
bun run src/index.tsx
```

Or execute directly if installed globally:

```bash
sasta-claude
```

## 📦 SDK Usage

You can import the core logic into your own TypeScript/Node.js applications.

```typescript
import { createAgent } from '@sasta/claude-sdk/sdk'; 
// (or import from src/sdk/index if running locally)

const agent = createAgent({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'gemini-2.0-flash' // Optional
});

// Chat with the agent
const response = await agent.sendMessage('List files in current directory');
console.log(response.text());

// Execute tools programmably
const listing = await agent.executeTool('list_files', { dirPath: './src' });
console.log(listing);
```

## Features

- **Full File System Access**: Read, write, move, copy, delete files and directories.
- **Shell Execution**: Run commands safely.
- **Deep Search**: `grep` and recursive file search.
- **Smart UI**: Interactive terminal interface built with Ink.

## License

MIT
