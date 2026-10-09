import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: { alias: { 'server-only': path.resolve(__dirname, 'tests/helpers/server-only-stub.ts') } },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/int/**/*.int.spec.ts'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
