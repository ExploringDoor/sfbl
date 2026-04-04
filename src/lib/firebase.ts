import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBTG3b_rFvD6s-KLvdi5GHIRtQLVaRuUf4",
  authDomain: "sfbl-acf51.firebaseapp.com",
  projectId: "sfbl-acf51",
  storageBucket: "sfbl-acf51.firebasestorage.app",
  messagingSenderId: "159476243392",
  appId: "1:159476243392:web:6a45d44852e9f3af294625"
};

function getApp() {
  if (getApps().length === 0) {
    return initializeApp(FIREBASE_CONFIG);
  }
  return getApps()[0];
}

let _db: Firestore | null = null;
let _auth: Auth | null = null;

export function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}

export { FIREBASE_CONFIG };
