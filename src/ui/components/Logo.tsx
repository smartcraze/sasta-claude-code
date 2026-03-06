// src/ui/components/Logo.tsx
import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

export const Logo = () => (
    <Box flexDirection="column" paddingBottom={1} paddingX={1}>
        <Gradient name="rainbow">
            <BigText text="Sasta Claude" font="block" align="center" />
        </Gradient>
        <Box justifyContent="center">
            <Text color="gray" italic>The best "Sasta" AI CLI you'll ever use.</Text>
        </Box>
    </Box>
);
