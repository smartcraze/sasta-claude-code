// src/ui/components/InputArea.tsx
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';

interface InputAreaProps {
    value?: string;
    onChange?: (val: string) => void;
    onSubmit: (value: string) => void;
    isLoading: boolean;
    loadingMessage?: string;
    isKeyInput?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
    value, onChange, onSubmit, isLoading, loadingMessage, isKeyInput = false 
}: InputAreaProps) => {
    // If value/onChange provided, use them (controlled), otherwise manage internal state (uncontrolled)
    const [internalValue, setInternalValue] = useState('');
    const actualValue = value !== undefined ? value : internalValue;
    const handleChange = (val: string) => {
        if (onChange) onChange(val);
        else setInternalValue(val);
    };

    const handleSubmit = (val: string) => {
        onSubmit(val);
        if (!onChange) setInternalValue(''); // Only clear if uncontrolled
    };

    if (isLoading) {
        return (
            <Box flexDirection="row" marginTop={1} paddingX={1}>
                <Text color="yellow">
                    <Spinner type="dots" /> {loadingMessage || 'Thinking...'}
                </Text>
            </Box>
        );
    }

    return (
        <Box flexDirection="row" marginTop={1} paddingX={1}>
            <Text bold color={isKeyInput ? "cyan" : "green"}>
                {isKeyInput ? "Enter API Key: " : "➜  "}
            </Text>
            <TextInput 
                value={actualValue} 
                onChange={handleChange} 
                onSubmit={handleSubmit}
                mask={isKeyInput ? "*" : undefined}
                placeholder={isKeyInput ? "Paste key here..." : "Type a message..."}
            />
        </Box>
    );
};

