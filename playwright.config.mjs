// Testes automatizados de navegador (Playwright). Uso: npm run test:e2e
import { defineConfig, devices } from '@playwright/test';

const PORTA = Number(process.env.PORTA_TESTES) || 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORTA}/`,
    trace: 'retain-on-failure',
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 800 } } },
    { name: 'celular', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs`,
    env: { PORT: String(PORTA) },
    url: `http://127.0.0.1:${PORTA}/`,
    reuseExistingServer: !process.env.CI,
  },
});
