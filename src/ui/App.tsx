import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp, Static, Newline } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import { createLLMClient, startChat } from '../llm/gemini.ts';
import { executeTool } from '../tools/index.ts';
import { config } from 'dotenv';
import { promises as fs } from 'node:fs';

config();

type Message = {
    id: string; // Unique ID for Static key
    role: 'user' | 'model' | 'tool' | 'system';
    content: string;
    isError?: boolean;
};

const App = () => {
    const { exit } = useApp();
    const [apiKey, setApiKey] = useState<string | null>(process.env.GEMINI_API_KEY || null);
    const [inputKey, setInputKey] = useState('');
    const [history, setHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [chatSession, setChatSession] = useState<any>(null);

    useEffect(() => {
        if (apiKey && !chatSession) {
            try {
                const model = createLLMClient(apiKey);
                const chat = startChat(model);
                setChatSession(chat);
            } catch (error) {
                // Handle initialization errors
            }
        }
    }, [apiKey]);

    const handleKeySubmit = async (key: string) => {
        if (!key.trim()) return;
        setApiKey(key);
        try {
            await fs.appendFile('.env', `\nGEMINI_API_KEY=${key}\n`);
        } catch (e) {}
    };

    const addMessage = (role: Message['role'], content: string, isError = false) => {
        setHistory(prev => [
            ...prev, 
            { 
                id: Math.random().toString(36).substring(7), 
                role, 
                content, 
                isError 
            }
        ]);
    };

    const handleInputSubmit = async (value: string) => {
        if (!value.trim() || !chatSession) return;
        
        const userMsg = value;
        setInputValue('');
        addMessage('user', userMsg);
        
        setIsLoading(true);
        setLoadingMessage('Thinking...');

        try {
            let result = await chatSession.sendMessage(userMsg);
            let response = result.response;
            
            let text = '';
            try { text = response.text(); } catch(e) {}
            
            if (text) {
                addMessage('model', text);
            }

            // Handle tool calls
            while (response.functionCalls() && response.functionCalls().length > 0) {
                const calls = response.functionCalls();
                const functionResponses = [];

                setLoadingMessage(`Executing ${calls.length} tool(s)...`);

                for (const call of calls) {
                     addMessage('tool', `Running tool: ${call.name}`);
                     
                     try {
                        const output = await executeTool(call.name, call.args);
                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { result: output }, 
                            }
                        });
                        // Truncate long outputs for display
                        const displayOutput = output.length > 500 ? output.slice(0, 500) + '... (truncated)' : output;
                        addMessage('tool', `Result: ${displayOutput}`);
                     } catch (error: any) {
                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { error: error.message },
                            }
                        });
                        addMessage('tool', `Error: ${error.message}`, true);
                     }
                }
                
                setLoadingMessage('Analyzing results...');
                result = await chatSession.sendMessage(functionResponses);
                response = result.response;

                try { 
                    text = response.text(); 
                    if (text) {
                         addMessage('model', text);
                    }
                } catch(e) {}
            }

        } catch (error: any) {
            addMessage('model', `Error: ${error.message}`, true);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    useInput((input, key) => {
        if (key.escape) {
            exit();
        }
    });

    if (!apiKey) {
        return (
            <Box flexDirection="column" padding={1}>
                <Gradient name="pastel">
                    <BigText text="Gemini CLI" font="tiny"/>
                </Gradient>
                <Box borderStyle="round" borderColor="cyan" flexDirection="column" padding={1}>
                    <Text>Please enter your Gemini API Key:</Text>
                    <TextInput 
                        value={inputKey} 
                        onChange={setInputKey} 
                        onSubmit={handleKeySubmit}
                        mask="*"
                    />
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Static items={history}>
                {(msg: Message) => (
                    <Box key={msg.id} flexDirection="column" marginBottom={1}>
                        <Text color={msg.role === 'user' ? 'green' : msg.role === 'model' ? 'blue' : 'yellow'} bold>
                            {msg.role === 'user' ? 'You' : msg.role === 'model' ? 'Gemini' : 'System'}:
                        </Text>
                        <Text color={msg.isError ? 'red' : 'white'}>
                            {msg.content}
                        </Text>
                    </Box>
                )}
            </Static>

            <Box flexDirection="column" paddingX={1}>
                {isLoading ? (
                    <Text color="yellow">
                        <Spinner type="dots" /> {loadingMessage}
                    </Text>
                ) : (
                    <Box>
                        <Text color="green" bold>{'> '}</Text>
                        <TextInput 
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleInputSubmit}
                            placeholder="Type a message..."
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default App;
