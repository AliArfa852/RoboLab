# RoboLabPK Deployment Guide

## Overview
This guide covers deployment options for RoboLabPK, including web deployment and mobile app distribution. The application is built with React, Vite, TypeScript, and Supabase, with Capacitor for mobile app packaging.

## Pre-Deployment Modifications Required

### 1. SEO and Meta Tags (CRITICAL)
Update `index.html` with proper meta tags:

```html
<title>RoboLabPK - Hardware Innovation Platform</title>
<meta name="description" content="Design circuits, get AI assistance, shop components, and discover project ideas. Your complete hardware innovation ecosystem." />
<meta name="author" content="RoboLabPK" />
<meta name="keywords" content="hardware, electronics, circuit design, AI assistant, components, Pakistan, innovation" />

<!-- Open Graph -->
<meta property="og:title" content="RoboLabPK - Hardware Innovation Platform" />
<meta property="og:description" content="Design circuits, get AI assistance, shop components, and discover project ideas. Your complete hardware innovation ecosystem." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="RoboLabPK - Hardware Innovation Platform" />
<meta name="twitter:description" content="Design circuits, get AI assistance, shop components, and discover project ideas." />
<meta name="twitter:image" content="https://yourdomain.com/twitter-image.png" />
```

### 2. Environment Configuration
Replace hardcoded Supabase URLs with proper environment handling:

**For Web Deployment:**
- Set proper CORS origins in Supabase dashboard
- Configure authentication redirects for your domain
- Update any hardcoded URLs to use your production domain

**For Mobile Deployment:**
- Configure deep links for authentication
- Set up proper app store metadata
- Configure push notification services (if applicable)

### 3. Production Assets
- Replace placeholder images with actual branded content
- Optimize images for web (WebP format recommended)
- Create app icons for mobile deployment
- Generate splash screens for mobile apps

### 4. Analytics and Monitoring
- Add Google Analytics or similar tracking
- Configure error monitoring (Sentry recommended)
- Set up performance monitoring

## Web Deployment Options

### Option 1: Lovable Platform (Easiest)
1. **Using Lovable's Built-in Deployment:**
   ```bash
   # In Lovable interface
   Click "Publish" button → Follow deployment wizard
   ```
   - Automatic SSL certificates
   - Global CDN
   - Custom domain support (paid plans)

### Option 2: Vercel (Recommended for Web)
1. **Prepare for Deployment:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Environment Variables on Vercel:**
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - Any other secrets via Vercel dashboard

### Option 3: Netlify
1. **Build Command:** `npm run build`
2. **Publish Directory:** `dist`
3. **Environment Variables:** Same as Vercel
4. **Redirects file** (`public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Option 4: Traditional Hosting (cPanel, etc.)
1. **Build the project:**
   ```bash
   npm run build
   ```
2. **Upload `dist` folder contents** to your hosting provider
3. **Configure server** for SPA routing

## Mobile App Deployment

### Prerequisites
- **For iOS:** Mac with Xcode, Apple Developer Account ($99/year)
- **For Android:** Android Studio, Google Play Console Account ($25 one-time)

### Step 1: Mobile App Preparation
1. **Export project to GitHub:**
   ```bash
   # Use Lovable's "Export to GitHub" feature
   ```

2. **Setup local development:**
   ```bash
   git clone your-repo-url
   cd robolabpk
   npm install
   npm run build
   ```

3. **Add mobile platforms:**
   ```bash
   npx cap add ios
   npx cap add android
   ```

### Step 2: Configure App Metadata

**Update `capacitor.config.ts`:**
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.robolabpk.app', // Change this
  appName: 'RoboLabPK',
  webDir: 'dist',
  server: {
    url: 'https://your-production-domain.com', // Your web app URL
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    }
  }
};

export default config;
```

### Step 3: Android Deployment

1. **Sync and build:**
   ```bash
   npx cap sync android
   npx cap open android
   ```

2. **In Android Studio:**
   - Update `app/src/main/res/values/strings.xml`
   - Configure app signing in `Build → Generate Signed Bundle/APK`
   - Build release APK/AAB

3. **Upload to Google Play Console:**
   - Create app listing
   - Upload AAB file
   - Complete store listing requirements
   - Submit for review

### Step 4: iOS Deployment

1. **Sync and build:**
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

2. **In Xcode:**
   - Update Bundle Identifier
   - Configure signing certificates
   - Archive and validate app

3. **Upload to App Store Connect:**
   - Create app in App Store Connect
   - Upload via Xcode or Transporter
   - Complete app metadata
   - Submit for review

## Production Checklist

### Security
- [ ] Enable RLS policies on all Supabase tables
- [ ] Configure proper CORS origins
- [ ] Remove development/debug features
- [ ] Secure API endpoints
- [ ] Enable authentication redirects for production domain

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Configure CDN (if not using Vercel/Netlify)
- [ ] Enable browser caching headers
- [ ] Implement lazy loading for heavy components

### SEO & Analytics
- [ ] Update meta tags and Open Graph data
- [ ] Add sitemap.xml
- [ ] Configure Google Analytics
- [ ] Set up error monitoring
- [ ] Add structured data markup

### Testing
- [ ] Test all routes and functionality
- [ ] Verify mobile responsiveness
- [ ] Test authentication flows
- [ ] Validate form submissions
- [ ] Check error handling

### Legal & Compliance
- [ ] Privacy policy page
- [ ] Terms of service
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if applicable)

## Post-Deployment

### Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics
- Track user analytics

### Maintenance
- Regular dependency updates
- Security patches
- Database backups
- Performance optimization

### Marketing
- Submit to app stores
- Social media presence
- SEO optimization
- Community engagement

## Troubleshooting

### Common Issues

**Build Errors:**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Mobile App Issues:**
- Ensure proper signing certificates
- Check app permissions in native code
- Verify deep link configurations

**Supabase Connection:**
- Verify environment variables
- Check CORS settings
- Validate API keys

### Support Resources
- [Lovable Documentation](https://docs.lovable.dev/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Estimated Timeline
- **Web Deployment:** 1-2 days
- **Mobile App Preparation:** 3-5 days
- **App Store Review:** 1-7 days (Apple), 1-3 days (Google)
- **Total:** 1-2 weeks for complete deployment

Remember to test thoroughly in staging environments before production deployment!