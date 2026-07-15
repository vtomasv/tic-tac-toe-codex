import { defineConfig, defineProject } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      defineProject({
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/domain/**/*.test.ts'],
        },
      }),
      defineProject({
        plugins: [react()],
        test: {
          name: 'component',
          environment: 'jsdom',
          include: ['src/components/**/*.test.tsx'],
          setupFiles: ['src/test/setup.ts'],
        },
      }),
    ],
  },
});
