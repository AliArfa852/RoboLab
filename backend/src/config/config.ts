import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  // Server
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  
  // Database
  mongodbUri: string;
  redisUrl: string;
  redisPassword?: string;
  
  // Firebase
  firebaseProjectId: string;
  firebasePrivateKeyId: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  firebaseClientId: string;
  firebaseAuthUri: string;
  firebaseTokenUri: string;
  firebaseAuthProviderX509CertUrl: string;
  firebaseClientX509CertUrl: string;
  
  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // AI Services
  openaiApiKey: string;
  openaiModel: string;
  aiDailyLimit: number;
  
  // File Upload
  uploadMaxSize: number;
  allowedFileTypes: string[];
  
  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // Email
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail?: string;
  
  // Logging
  logLevel: string;
  logFile: string;
  
  // Security
  bcryptRounds: number;
  sessionSecret: string;
  
  // External APIs
  googleMapsApiKey?: string;
  weatherApiKey?: string;
  
  // Monitoring
  sentryDsn?: string;
  healthCheckInterval: number;
  
  // Development
  debugMode: boolean;
  enableSwagger: boolean;
  enableCors: boolean;
}

const config: Config = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/robo_lab',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  redisPassword: process.env.REDIS_PASSWORD,
  
  // Firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebasePrivateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || '',
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebaseClientId: process.env.FIREBASE_CLIENT_ID || '',
  firebaseAuthUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
  firebaseTokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
  firebaseAuthProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
  firebaseClientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Services
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  aiDailyLimit: parseInt(process.env.AI_DAILY_LIMIT || '10', 10),
  
  // File Upload
  uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf,application/json').split(','),
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Email
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  fromEmail: process.env.FROM_EMAIL || 'noreply@robolab.pk',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'logs/app.log',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
  
  // External APIs
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  weatherApiKey: process.env.WEATHER_API_KEY,
  
  // Monitoring
  sentryDsn: process.env.SENTRY_DSN,
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10),
  
  // Development
  debugMode: process.env.DEBUG_MODE === 'true',
  enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
  enableCors: process.env.ENABLE_CORS !== 'false',
};

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'JWT_SECRET',
  'MONGODB_URI'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Warn about missing optional but recommended variables
const recommendedEnvVars = [
  'OPENAI_API_KEY',
  'REDIS_URL'
];

const missingRecommended = recommendedEnvVars.filter(envVar => !process.env[envVar]);

if (missingRecommended.length > 0 && config.nodeEnv === 'production') {
  console.warn(`Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`);
}

export { config };
