import React from 'react';
import { Box, Text } from 'ink';

export type MessageRole = 'user' | 'model' | 'tool' | 'system';

export interface MessageProps {
    role: MessageRole;
    content: string;
    isError?: boolean;
}

export const MessageView: React.FC<MessageProps> = ({ role, content, isError }) => {
    if (role === 'user') {
        return (
            <Box flexDirection="column" marginTop={1} paddingX={1}>
                <Text bold color="green">➜ You</Text>
                <Box paddingLeft={2}>
                    <Text>{content}</Text>
                </Box>
            </Box>
        );
    }

    if (role === 'tool') {
        return (
            <Box flexDirection="row" paddingLeft={2} marginTop={0}>
                <Text color="gray" dimColor>⚙️ {content}</Text>
            </Box>
        );
    }

    if (role === 'system') {
         return (
            <Box flexDirection="column" paddingLeft={2} marginTop={1}>
                <Text color="yellow" bold>System:</Text>
                <Text color="yellow" dimColor>{content}</Text>
            </Box>
        );
    }

    // Model (Assistant)
    return (
        <Box flexDirection="column" marginTop={1} paddingX={1}>
            <Text bold color={isError ? "red" : "magenta"}>Sasta Claude</Text>
            <Box paddingLeft={2} flexDirection="column">
                <Text color={isError ? "red" : undefined}>
                    {content}
                </Text>
            </Box>
        </Box>
    );
};
