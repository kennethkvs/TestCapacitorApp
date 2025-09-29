import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.testCapacitorApp.app",
  appName: "testCapacitorApp",
  webDir: "out",
  server: {
    url: "http://192.168.2.197:3000",
    cleartext: true,
  },
};

export default config;
