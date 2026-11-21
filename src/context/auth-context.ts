import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  refreshUser: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
