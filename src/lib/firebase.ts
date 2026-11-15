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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.projectId,
  firebaseConfig.appId,
]

export const firebaseConfigured = requiredConfig.every(
  (value) => typeof value === 'string' && value.trim().length > 0,
)

let app: FirebaseApp | null = null
let ai: AI | null = null
let appCheck: AppCheck | null = null

if (firebaseConfigured) {
  app = getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY

  if (recaptchaSiteKey) {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  }

  ai = getAI(app, {
    backend: new GoogleAIBackend(),
  })
}

export { app, ai, appCheck }

export const appCheckConfigured = appCheck !== null

export function getFirebaseAI(): AI {
  if (!ai) {
    throw new Error(
      'Firebase is not configured. Add the required VITE_FIREBASE_* values to your local environment file.',
    )
  }

  return ai
}
