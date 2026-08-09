import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Avoid production env validation during tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
