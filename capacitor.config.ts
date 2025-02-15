import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'roamingLocator',
  webDir: 'www',
  server: {
    androidScheme: 'http',
   // url: "http://192.168.1.41:3000",
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  }
};

export default config;
