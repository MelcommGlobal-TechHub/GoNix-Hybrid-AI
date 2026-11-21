import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  signInWithRedirect,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import {
  getFirebaseAuth,
  getFirestoreDB,
  firestoreConfigured,
} from '../lib/firebase'
import { useAuth } from '../context/useAuth'
import './AuthPage.css'

type Mode = 'login' | 'register' | 'forgot' | 'verify'

const MAX_BIRTH_DATE = new Date().toISOString().slice(0, 10)

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return false
  }
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return value <= today
}

function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code

  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'An account already exists with this email address.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/popup-closed-by-user': 'The Google sign-in window was closed.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow popups and retry.',
    'auth/unauthorized-domain': 'This domain is not authorised for Firebase sign-in.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/requires-recent-login': 'Please sign in again and retry this action.',
  }

  return messages[code ?? ''] ?? 'Something went wrong. Please try again.'
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, configured, refreshUser } = useAuth()

  const mode: Mode =
    location.pathname === '/register'
      ? 'register'
      : location.pathname === '/forgot-password'
        ? 'forgot'
        : location.pathname === '/verify-email'
          ? 'verify'
          : 'login'

  const [name, setName] = useState('')
  const [country, setCountry] = useState('Nigeria')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const destination =
    (location.state as { from?: { pathname?: string } } | null)
      ?.from?.pathname ?? '/dashboard'

  const verificationState = useMemo(
    () => ({
      from: (location.state as { from?: unknown } | null)?.from,
    }),
    [location.state],
  )

  useEffect(() => {
    if (!configured) return

    let active = true

    getRedirectResult(getFirebaseAuth())
      .then(async (result) => {
        if (!active || !result) return

        if (!result.user.emailVerified) {
          await sendEmailVerification(result.user)
          if (active) {
            navigate('/verify-email', {
              replace: true,
              state: verificationState,
            })
          }
          return
        }

        if (active) navigate(destination, { replace: true })
      })
      .catch((caught: unknown) => {
        if (active) setError(friendlyError(caught))
      })

    return () => {
      active = false
    }
  }, [configured, destination, navigate, verificationState])

  if (user?.emailVerified) {
    return <Navigate to={destination} replace />
  }

async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)

    let newlyCreatedUser: User | null = null
    let profileCreated = false

    try {
      const auth = getFirebaseAuth()

      if (mode === 'register') {
        const cleanName = name.trim()
        const cleanCountry = country.trim()
        const cleanPhone = phoneNumber.trim().replace(/[\s()-]/g, '')

        if (cleanName.length < 2) throw new Error('Enter your full name to create your account.')
        if (!cleanCountry) throw new Error('Select your country.')
        if (!isValidBirthDate(dateOfBirth)) throw new Error('Enter a valid date of birth that is not in the future.')
        if (password !== confirmPassword) throw new Error('Your password confirmation does not match.')
        if (cleanPhone && !/^\+[1-9]\d{6,14}$/.test(cleanPhone)) throw new Error('Enter your phone number with its international calling code.')
        if (!firestoreConfigured) throw new Error('Account profile storage is unavailable. Please try again later.')

        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        newlyCreatedUser = credential.user

        await updateProfile(credential.user, { displayName: cleanName })

        await setDoc(doc(getFirestoreDB(), 'users', credential.user.uid), {
          displayName: cleanName,
          headline: '',
          country: cleanCountry,
          education: '',
          bio: '',
          skills: '',
          interests: '',
          dateOfBirth: Timestamp.fromDate(new Date(`${dateOfBirth}T00:00:00.000Z`)),
          phoneNumber: cleanPhone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        profileCreated = true
        await sendEmailVerification(credential.user)

        setMessage('Your account has been created. Check your email for the verification link.')
        navigate('/verify-email', { replace: true, state: verificationState })
      } else if (mode === 'login') {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password)

        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user)
          navigate('/verify-email', { replace: true, state: verificationState })
          return
        }

        navigate(destination, { replace: true })
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email.trim())
        setMessage('If an account exists for this address, a password-reset email has been sent.')
      } else {
        throw new Error('Use the verification actions below.')
      }
    } catch (caught) {
      if (newlyCreatedUser) {
        setMessage(
          profileCreated
            ? 'Your profile is ready. Check your inbox for the verification email. If it does not arrive, use Resend verification email.'
            : 'Your account was created, but profile setup did not finish. Verify your email, then complete your profile from your account settings.'
        )

        try {
          await sendEmailVerification(newlyCreatedUser)
        } catch {
          // Manual resend remains available on the verification screen.
        }

        navigate('/verify-email', {
          replace: true,
          state: { ...verificationState, registrationNeedsProfile: !profileCreated },
        })
      } else {
        setError(
          caught instanceof Error && !('code' in caught)
            ? caught.message
            : friendlyError(caught)
        )
      }
    } finally {
      setBusy(false)
    }
  }

  async function googleSignIn() {
    setError('')
    setMessage('')
    setBusy(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      const auth = getFirebaseAuth()
      await setPersistence(auth, browserLocalPersistence)
      await signInWithRedirect(auth, provider)
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  async function resendVerification() {
    setError('')
    setMessage('')
    setBusy(true)

    try {
      const currentUser = getFirebaseAuth().currentUser

      if (!currentUser) {
        setMessage(
          'Sign in with your email and password first. You can then request another verification email.',
        )
        navigate('/login')
        return
      }

      if (currentUser.emailVerified) {
        setMessage('Your email is already verified.')
        return
      }

      await sendEmailVerification(currentUser)

      setMessage(
        'A new verification email has been sent. Check your inbox and spam folder.',
      )
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  async function checkVerification() {
    setError('')
    setMessage('')
    setBusy(true)

    try {
      const verified = await refreshUser()

      if (verified) {
        setMessage('Email verified. Opening your NEXORA account…')
        navigate(destination, { replace: true })
      } else {
        setMessage(
          'Firebase has not confirmed your verification yet. Open the latest verification email, follow its link, and try again.',
        )
      }
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  const titles: Record<Mode, string> = {
    login: 'Welcome back',
    register: 'Create your NEXORA account',
    forgot: 'Reset your password',
    verify: 'Verify your email',
  }

  const descriptions: Record<Mode, string> = {
    login: 'Sign in to continue your journey.',
    register: 'One account connects you to the NEXORA ecosystem.',
    forgot: 'We will send instructions to your email address.',
    verify: 'Verify your email address to protect your account.',
  }

  if (!configured) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Authentication unavailable</h1>
          <p>Firebase is not configured. Please try again later.</p>
          <Link to="/">Return to NEXORA</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-brand" aria-label="NEXORA home">
          <span className="auth-brand-mark">N</span>
          <span>NEXORA</span>
        </Link>

        <span className="auth-eyebrow">THE NEXT ERA STARTS HERE</span>
        <h1>{titles[mode]}</h1>
        <p className="auth-description">{descriptions[mode]}</p>

        {error && (
          <div className="auth-alert auth-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-alert auth-success" role="status">
            {message}
          </div>
        )}

        {mode === 'verify' ? (
          <div className="auth-actions">
            <p>
              {user
                ? `A verification link was sent to ${user.email ?? 'your email address'}. Open that email and follow the link.`
                : 'Sign in with your email and password to access verification options.'}
            </p>

            {user && (
              <>
                <button
                  type="button"
                  onClick={checkVerification}
                  disabled={busy}
                >
                  {busy ? 'Checking…' : "I've verified my email"}
                </button>

                <button
                  type="button"
                  className="auth-google"
                  onClick={resendVerification}
                  disabled={busy}
                >
                  {busy ? 'Please wait…' : 'Resend verification email'}
                </button>
              </>
            )}

            {!user && <Link to="/login">Sign in to continue</Link>}
            <Link to="/">Return to NEXORA home</Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <label>
                Full name
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your name"
                />
              </label>
            )}

            {mode === 'register' && (
              <>
                <label>
                  Country
                  <select value={country} onChange={(event) => setCountry(event.target.value)} required>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Date of birth
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    max={MAX_BIRTH_DATE}
                    required
                  />
                </label>
                <label>
                  Phone number (optional)
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    maxLength={25}
                    placeholder="+2348012345678"
                  />
                  <small>Include your international calling code.</small>
                </label>
              </>
            )}

            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </label>

            {mode !== 'forgot' && (
              <label>
                Password
                <input
                  type="password"
                  autoComplete={
                    mode === 'register' ? 'new-password' : 'current-password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  placeholder="At least 6 characters"
                />
              </label>
            )}

            {mode === 'register' && (
              <label>
                Confirm password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  placeholder="Enter your password again"
                />
              </label>
            )}

            <button type="submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'register'
                  ? 'Create account'
                  : mode === 'forgot'
                    ? 'Send reset link'
                    : 'Sign in'}
            </button>
          </form>
        )}

        {(mode === 'login' || mode === 'register') && (
          <>
            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-google"
              onClick={googleSignIn}
              disabled={busy}
            >
              <svg aria-hidden="true" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.47 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.62 5.91c4.45-4.11 7.15-10.16 7.15-17.56z"/>
                <path fill="#FBBC05" d="M10.54 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.26-8.28 2.26-6.26 0-11.53-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className="auth-links">
          {mode === 'login' && (
            <>
              <Link to="/forgot-password">Forgot password?</Link>
              <p>
                New to NEXORA? <Link to="/register">Create an account</Link>
              </p>
            </>
          )}

          {mode === 'register' && (
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remembered your password? <Link to="/login">Sign in</Link>
            </p>
          )}
        </div>

        <p className="auth-legal">
          By continuing, you agree to use NEXORA responsibly and follow its
          community guidelines.
        </p>
      </section>
    </main>
  )
}
