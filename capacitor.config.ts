import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.557746123e904a6eaf364ec52da2630b',
  appName: 'tinker-craft-ai',
  webDir: 'dist',
  server: {
    url: "https://55774612-3e90-4a6e-af36-4ec52da2630b.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;