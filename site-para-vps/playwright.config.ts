import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'

/**
 * Testes ponta a ponta. Requer o banco populado (npm run seed).
 * Usa o Google Chrome instalado (PW_CHANNEL=chromium para o navegador do Playwright).
 */
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    channel: process.env.PW_CHANNEL || 'chrome',
    locale: 'pt-BR',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || 'chrome' }, testIgnore: /mobile\.e2e/ },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL || 'chrome' }, testMatch: /mobile\.e2e/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev', reuseExistingServer: true, url: baseURL, timeout: 180_000 },
})
