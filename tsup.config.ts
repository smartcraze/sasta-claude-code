import { defineConfig } from 'tsup';

const commonConfig = {
  splitting: false,
  sourcemap: true,
  clean: false, // Managed manually or by first config
  platform: 'node' as const,
  target: 'node18',
  external: [
    'react', 
    'ink', 
    'ink-big-text',
    'ink-gradient', 
    'ink-spinner', 
    'ink-text-input'
  ],
};

export default defineConfig([
  {
    ...commonConfig,
    entry: { 'index': 'src/sdk/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true, // Clean dist folder before starting
  },
  {
    ...commonConfig,
    entry: { 'cli': 'src/index.tsx' },
    format: ['esm'], // CLI is ESM only
    dts: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
