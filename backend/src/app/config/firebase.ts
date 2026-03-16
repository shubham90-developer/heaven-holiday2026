import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App;

try {
  if (!admin.apps.length) {
    // Check if service account JSON exists (for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Option 1: Using service account from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      // console.log('✅ Firebase Admin initialized with service account');
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // Option 2: Using individual environment variables
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      console.log('✅ Firebase Admin initialized with credentials');
    } else {
      // Option 3: For development/testing - use Application Default Credentials
      // This will work if you're running locally with gcloud auth
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'bigsell-b8d28',
      });
      console.log('⚠️ Firebase Admin initialized with default credentials (limited functionality)');
    }
  } else {
    firebaseAdmin = admin.app();
  }

  console.log('✅ Firebase Admin SDK ready');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
  throw error;
}

export { firebaseAdmin };
export const firebaseAuth = admin.auth(firebaseAdmin);
