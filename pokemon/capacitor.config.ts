import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.pokemon',
  appName: 'Pokemon',
  webDir: 'www',
  "plugins": {
    "CapacitorHttp": {
      "enabled": true
    }
  }
};

export default config;
