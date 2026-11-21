import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, reload, type User } from 'firebase/auth'
import { getFirebaseAuth, authConfigured } from '../lib/firebase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(authConfigured)
  const [, setUserRevision] = useState(0)

  useEffect(() => {
    if (!authConfigured) return

    return onAuthStateChanged(
      getFirebaseAuth(),
      (nextUser) => {
        setUser(nextUser)
        setLoading(false)
      },
      () => {
        setUser(null)
        setLoading(false)
      },
    )
  }, [])

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const currentUser = authConfigured
      ? getFirebaseAuth().currentUser
      : null

    if (!currentUser) {
      setUser(null)
      return false
    }

    await reload(currentUser)

    // Refresh the token so Firestore Rules receive the latest
    // email_verified claim after the user verifies their email.
    await currentUser.getIdToken(true)

    setUser(currentUser)
    setUserRevision((revision) => revision + 1)

    return currentUser.emailVerified
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: authConfigured,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
