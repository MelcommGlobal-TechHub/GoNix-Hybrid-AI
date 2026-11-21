import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAI,
  GoogleAIBackend,
  type AI,
} from 'firebase/ai'
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from 'firebase/app-check'
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.projectId,
  firebaseConfig.appId,
]

export const firebaseConfigured = requiredConfig.every(
  (value) => typeof value === 'string' && value.trim().length > 0,
)

const emulatorRequested =
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'

if (emulatorRequested && !import.meta.env.DEV) {
  throw new Error(
    'Firebase Emulator mode can only be enabled during development.',
  )
}

if (emulatorRequested && !firebaseConfigured) {
  throw new Error(
    'Firebase Emulator mode requires a complete Firebase configuration.',
  )
}

if (
  emulatorRequested &&
  firebaseConfig.projectId !== 'gonix-hybrid-ai'
) {
  throw new Error(
    'Firebase Emulator mode requires project ID gonix-hybrid-ai.',
  )
}

const useFirebaseEmulators = emulatorRequested && import.meta.env.DEV

let app: FirebaseApp | null = null
let ai: AI | null = null
let appCheck: AppCheck | null = null

if (firebaseConfigured) {
  app = getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY

  if (recaptchaSiteKey && !useFirebaseEmulators) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  }

  ai = getAI(app, {
    backend: new GoogleAIBackend(),
  })
}

const auth: Auth | null = app ? getAuth(app) : null
const db: Firestore | null = app ? getFirestore(app) : null

if (useFirebaseEmulators && auth && db) {
  connectAuthEmulator(
    auth,
    'http://127.0.0.1:9099',
    { disableWarnings: true },
  )

  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

// Storage remains unavailable until its bucket is configured.
const storage: FirebaseStorage | null =
  app && firebaseConfig.storageBucket
    ? getStorage(app)
    : null

export { app, ai, appCheck, auth, db, storage }

export const appCheckConfigured = appCheck !== null
export const authConfigured = auth !== null
export const firestoreConfigured = db !== null
export const storageConfigured = storage !== null

export function getFirebaseAI(): AI {
  if (!ai) {
    throw new Error(
      'Firebase AI is not configured. Check the VITE_FIREBASE_* environment variables.',
    )
  }

  return ai
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured.')
  }

  return auth
}

export function getFirestoreDB(): Firestore {
  if (!db) {
    throw new Error('Cloud Firestore is not configured.')
  }

  return db
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error(
      'Firebase Storage is not configured. Add VITE_FIREBASE_STORAGE_BUCKET and enable Firebase Storage.',
    )
  }

  return storage
}
