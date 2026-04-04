// Firebase configuration for SFBL
// TODO: Install firebase (npm install firebase) and replace with actual credentials
export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'sfbl-xxxxx.firebaseapp.com',
  projectId: 'sfbl-xxxxx',
  storageBucket: 'sfbl-xxxxx.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:xxxxxxxxxxxxxx',
};

// Placeholder - will be implemented once firebase is installed
export async function getDb(): Promise<unknown> {
  console.warn('Firebase not configured yet. Install firebase and update credentials.');
  return null;
}
