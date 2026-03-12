import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fieldpak.scan',
  appName: 'DocumentScanner',
  webDir: 'www',
  plugins:{
    LiveUpdate:{
      appId: 'de353bab-5223-40f1-b111-650cc8e23a0b',
    }
  }
};

export default config;
