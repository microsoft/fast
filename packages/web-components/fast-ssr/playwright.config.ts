// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run test-server',
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: false
  },
};
export default config;
