// src/ui/components/StatusBar.tsx
import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
    cwd: string;
    model: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ cwd, model }) => {
    return (
        <Box paddingX={1} marginTop={1} justifyContent="space-between" borderStyle="single" borderColor="gray" borderBottom={false} borderLeft={false} borderRight={false} borderTop={true}>
            <Text dimColor>📂 {cwd}</Text>
            <Text dimColor>{model}</Text>
        </Box>
    );
};

