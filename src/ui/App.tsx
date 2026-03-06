import React, { useState, useEffect } from 'react';
import { Box, useApp, Static, useInput } from 'ink';
import { createAgent } from '../sdk/index';
import { config } from 'dotenv';
import { promises as fs } from 'node:fs';

// Components
import { Logo } from './components/Logo';
import { InputArea } from './components/InputArea';
import { StatusBar } from './components/StatusBar';
import { MessageView, MessageRole } from './components/MessageView';

config();

type Message = {
    id: string; 
    role: MessageRole;
    content: string;
    isError?: boolean;
};

const App = () => {
    const { exit } = useApp();
    const [apiKey, setApiKey] = useState<string | null>(process.env.GEMINI_API_KEY || null);
    
    // Agent State
    const [agent, setAgent] = useState<ReturnType<typeof createAgent> | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [cwd, setCwd] = useState(process.cwd());

    // Initialize Agent
    useEffect(() => {
        if (apiKey && !agent) {
             try {
                const newAgent = createAgent({
                    apiKey,
                    modelName: process.env.GEMINI_MODEL || "gemini-2.0-flash"
                });
                setAgent(newAgent);
             } catch (e) {
                 // handle init error?
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
        if (!value.trim() || !agent) return;
        
        const userMsg = value;
        setInputValue(''); // Clear input
        addMessage('user', userMsg);
        
        setIsLoading(true);
        setLoadingMessage('Thinking...');

        try {
            let result = await agent.session.sendMessage(userMsg);
            let response = result.response;
            
            let text = '';
            try { text = response.text(); } catch(e) {}
            
            if (text) {
                addMessage('model', text);
            }

            // Handle tool calls
            while (response.functionCalls() && response.functionCalls().length > 0) {
                const calls = response.functionCalls();
                setLoadingMessage(`Executing ${calls.length} tool(s)...`);

                const functionResponses = [];

                for (const call of calls) {
                     addMessage('tool', `Running tool: ${call.name}`);
                     
                     try {
                        const output = await agent.executeTool(call.name, call.args);
                       
                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { result: output }, 
                            }
                        });
                     } catch (error: any) {
                         const err = `Error executing ${call.name}: ${error.message}`;
                         addMessage('tool', err, true);
                         functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { result: err }, 
                            }
                        });
                     }
                }

                // Send tool outputs back to model
                if (functionResponses.length > 0) {
                    setLoadingMessage('Analyzing tool outputs...');
                    const nextResult = await agent.session.sendMessage(functionResponses);
                    response = nextResult.response;
                    
                    try { 
                        text = response.text(); 
                        if (text) {
                             addMessage('model', text);
                        }
                    } catch(e) {}
                }
            }

        } catch (error: any) {
            addMessage('model', `Error: ${error.message}`, true);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            // Refresh CWD in UI
            setCwd(process.cwd());
        }
    };

    useInput((input, key) => {
        if (key.escape) {
            exit();
        }
    });

    if (!apiKey) {
        return (
            <Box flexDirection="column" padding={1} height="100%">
               <Logo />
               <Box flexGrow={1} />
               <InputArea 
                 onSubmit={handleKeySubmit}
                 isLoading={false}
                 loadingMessage=""
                 isKeyInput={true}
                 value=""
                 onChange={() => {}}
               />
            </Box>
        );
    }

    return (
        <Box flexDirection="column" padding={1}>
            {/* Header / Logo - maybe just once at top? */}
            <Static items={['header']}>
                {() => <Logo key="header" />}
            </Static>

            {/* Scrollable History Area */}
            <Box flexDirection="column" flexGrow={1} marginBottom={1}>
                <Static items={history}>
                    {(msg: Message) => (
                        <MessageView 
                            key={msg.id}
                            role={msg.role}
                            content={msg.content}
                            isError={msg.isError}
                        />
                    )}
                </Static>
            </Box>

            {/* Footer Area */}
            <Box flexDirection="column" marginTop={1}>
                {/* Status Bar */}
                <StatusBar cwd={cwd} model={process.env.GEMINI_MODEL || "gemini-2.0-flash"} />
                
                {/* Input Area */}
                <InputArea 
                    value={inputValue}
                    onChange={setInputValue}
                    onSubmit={handleInputSubmit}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                />
            </Box>
        </Box>
    );
};

export default App;
