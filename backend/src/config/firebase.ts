import admin from 'firebase-admin';
import { config } from './config';
import { logger } from '@/utils/logger';

// Firebase Admin SDK configuration
const firebaseConfig = {
  type: 'service_account',
  project_id: config.firebaseProjectId,
  private_key_id: config.firebasePrivateKeyId,
  private_key: config.firebasePrivateKey?.replace(/\\n/g, '\n'),
  client_email: config.firebaseClientEmail,
  client_id: config.firebaseClientId,
  auth_uri: config.firebaseAuthUri,
  token_uri: config.firebaseTokenUri,
  auth_provider_x509_cert_url: config.firebaseAuthProviderX509CertUrl,
  client_x509_cert_url: config.firebaseClientX509CertUrl,
};

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
  try {
    if (firebaseApp) {
      return firebaseApp;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      projectId: config.firebaseProjectId,
    });

    logger.info('✅ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('❌ Firebase initialization error:', error);
    throw error;
  }
};

// Get Firebase Auth instance
export const getFirebaseAuth = (): admin.auth.Auth => {
  const app = initializeFirebase();
  return admin.auth(app);
};

// Get Firestore instance
export const getFirestore = (): admin.firestore.Firestore => {
  const app = initializeFirebase();
  return admin.firestore(app);
};

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification error:', error);
    throw new Error('Invalid Firebase token');
  }
};

// Create custom token
export const createCustomToken = async (uid: string, additionalClaims?: any): Promise<string> => {
  try {
    const auth = getFirebaseAuth();
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    logger.error('Error creating custom token:', error);
    throw new Error('Failed to create custom token');
  }
};

// Get user by UID
export const getFirebaseUser = async (uid: string): Promise<admin.auth.UserRecord> => {
  try {
    const auth = getFirebaseAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    logger.error('Error getting Firebase user:', error);
    throw new Error('User not found');
  }
};

// Update user claims
export const setCustomUserClaims = async (uid: string, customClaims: any): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await auth.setCustomUserClaims(uid, customClaims);
    logger.info(`Custom claims set for user ${uid}`);
  } catch (error) {
    logger.error('Error setting custom claims:', error);
    throw new Error('Failed to set custom claims');
  }
};

// Delete user
export const deleteFirebaseUser = async (uid: string): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await auth.deleteUser(uid);
    logger.info(`User ${uid} deleted successfully`);
  } catch (error) {
    logger.error('Error deleting Firebase user:', error);
    throw new Error('Failed to delete user');
  }
};

// List users with pagination
export const listFirebaseUsers = async (maxResults: number = 1000, pageToken?: string): Promise<admin.auth.ListUsersResult> => {
  try {
    const auth = getFirebaseAuth();
    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    return listUsersResult;
  } catch (error) {
    logger.error('Error listing Firebase users:', error);
    throw new Error('Failed to list users');
  }
};

// Health check for Firebase
export const checkFirebaseHealth = async (): Promise<boolean> => {
  try {
    const auth = getFirebaseAuth();
    await auth.listUsers(1); // Simple test to check if Firebase is accessible
    return true;
  } catch (error) {
    logger.error('Firebase health check failed:', error);
    return false;
  }
};

export default { initializeFirebase, getFirebaseAuth, getFirestore, verifyFirebaseToken };
