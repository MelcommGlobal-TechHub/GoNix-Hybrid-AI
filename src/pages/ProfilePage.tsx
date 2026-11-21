import { useEffect, useState, type FormEvent } from 'react'
import { updateProfile } from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { getFirebaseAuth, getFirestoreDB, firestoreConfigured } from '../lib/firebase'
import { useAuth } from '../context/useAuth'

const MAX_BIRTH_DATE = new Date().toISOString().slice(0, 10)

type ProfileFields = {
  dateOfBirth: string
  phoneNumber: string
  name: string
  headline: string
  country: string
  education: string
  bio: string
  skills: string
  interests: string
}

const defaults: ProfileFields = {
  dateOfBirth: '',
  phoneNumber: '',
  name: '',
  headline: '',
  country: 'Nigeria',
  education: '',
  bio: '',
  skills: 'Digital literacy, Communication',
  interests: 'Artificial Intelligence, Software Development',
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function readBirthDate(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString().slice(0, 10)
  }
  // Read older profiles created before the Timestamp migration.
  return typeof value === 'string' ? value : ''
}

export default function ProfilePage() {
  const { user } = useAuth()

  const [profile, setProfile] = useState<ProfileFields>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProfile() {
      if (!user || !firestoreConfigured) {
        if (active) {
          setLoading(false)
          setError('Profile storage is currently unavailable.')
        }
        return
      }

      try {
        const profileRef = doc(getFirestoreDB(), 'users', user.uid)
        const snapshot = await getDoc(profileRef)

        if (!active) return

        if (snapshot.exists()) {
          const data = snapshot.data()

          setProfile({
            dateOfBirth: readBirthDate(data.dateOfBirth),
            phoneNumber: readString(data.phoneNumber, ''),
            name: readString(data.displayName, user.displayName ?? ''),
            headline: readString(data.headline, ''),
            country: readString(data.country, 'Nigeria'),
            education: readString(data.education, ''),
            bio: readString(data.bio, ''),
            skills: readString(
              data.skills,
              defaults.skills,
            ),
            interests: readString(
              data.interests,
              defaults.interests,
            ),
          })
        } else {
          setProfile({
            ...defaults,
            name: user.displayName ?? '',
          })
        }
      } catch {
        if (active) {
          setError(
            'Unable to load your saved profile. Check your connection and Firestore access.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadProfile()

    return () => {
      active = false
    }
  }, [user])

  function updateField<K extends keyof ProfileFields>(
    field: K,
    value: ProfileFields[K],
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const initials = profile.name.trim()
    ? profile.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'GU'

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!user) {
      setError('You must be signed in to save your profile.')
      return
    }

    if (!firestoreConfigured) {
      setError('Firestore is not configured for this application.')
      return
    }

    const cleanProfile: ProfileFields = {
      dateOfBirth: profile.dateOfBirth.trim(),
      phoneNumber: profile.phoneNumber.trim().replace(/[\s()-]/g, ''),
      name: profile.name.trim(),
      headline: profile.headline.trim(),
      country: profile.country.trim(),
      education: profile.education.trim(),
      bio: profile.bio.trim(),
      skills: profile.skills.trim(),
      interests: profile.interests.trim(),
    }

    if (cleanProfile.dateOfBirth && (
      !/^\d{4}-\d{2}-\d{2}$/.test(cleanProfile.dateOfBirth) ||
      Number.isNaN(new Date(`${cleanProfile.dateOfBirth}T00:00:00`).getTime()) ||
      new Date(`${cleanProfile.dateOfBirth}T00:00:00`).toISOString().slice(0, 10) !== cleanProfile.dateOfBirth ||
      cleanProfile.dateOfBirth > MAX_BIRTH_DATE
    )) {
      setError('Enter a valid date of birth that is not in the future.')
      return
    }
    if (cleanProfile.phoneNumber && !/^\+[1-9]\d{6,14}$/.test(cleanProfile.phoneNumber)) {
      setError('Enter your phone number with its international calling code.')
      return
    }

    if (cleanProfile.name.length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (cleanProfile.name.length > 80 ||
        cleanProfile.headline.length > 160 ||
        cleanProfile.country.length > 80 ||
        cleanProfile.education.length > 160 ||
        cleanProfile.bio.length > 2000 ||
        cleanProfile.skills.length > 1000 ||
        cleanProfile.interests.length > 1000) {
      setError('One or more fields exceed the permitted length.')
      return
    }

    setSaving(true)

    try {
      const profileRef = doc(getFirestoreDB(), 'users', user.uid)
      const existing = await getDoc(profileRef)

      const profileData = {
        ...(cleanProfile.dateOfBirth
          ? {
              dateOfBirth: Timestamp.fromDate(
                new Date(`${cleanProfile.dateOfBirth}T00:00:00.000Z`),
              ),
            }
          : {}),
        phoneNumber: cleanProfile.phoneNumber,
        displayName: cleanProfile.name,
        headline: cleanProfile.headline,
        country: cleanProfile.country,
        education: cleanProfile.education,
        bio: cleanProfile.bio,
        skills: cleanProfile.skills,
        interests: cleanProfile.interests,
        createdAt: existing.exists()
          ? existing.data().createdAt
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(profileRef, profileData)

      try {
        await updateProfile(getFirebaseAuth().currentUser!, {
          displayName: cleanProfile.name,
        })
      } catch {
        // The Firestore profile is already saved.
        // A Firebase Auth display-name sync failure must not undo it.
      }

      setProfile(cleanProfile)
      setMessage('Your NEXORA profile has been saved successfully.')
    } catch {
      setError(
        'Your profile could not be saved. Check your connection and Firestore security rules. No changes were confirmed.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="edu-page studio-page">
      <section className="edu-page-hero">
        <span className="studio-eyebrow">YOUR LEARNING IDENTITY</span>
        <h1>My Profile</h1>
        <p>
          Build your learner profile, describe your interests and organise
          your professional skills.
        </p>
      </section>

      <section className="profile-summary studio-panel">
        <div
          className="profile-avatar-large"
          aria-label={`Profile initials ${initials}`}
        >
          {initials}
        </div>

        <div className="profile-summary-copy">
          <span className="studio-eyebrow">LEARNER PROFILE</span>
          <h2>{profile.name.trim() || 'Your name'}</h2>
          <p>
            {profile.headline.trim() ||
              'Add a headline describing your learning or professional interests.'}
          </p>
          <span className="profile-country">{profile.country}</span>
        </div>

        <span className="studio-count">
          {loading ? 'Loading profile…' : 'Personal profile'}
        </span>
      </section>

      <form className="studio-panel profile-form" onSubmit={saveProfile}>
        <div className="edu-section-heading">
          <div>
            <span className="studio-eyebrow">PERSONAL INFORMATION</span>
            <h2>Profile details</h2>
          </div>
        </div>

        {error && (
          <p className="studio-status" role="alert">
            {error}
          </p>
        )}

        <div className="profile-fields-grid">
          <label>
            Full name
            <input
              value={profile.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Enter your full name"
              maxLength={80}
              required
              disabled={loading || saving}
            />
          </label>

          <label>
            Date of birth
            <input
              type="date"
              value={profile.dateOfBirth}
              max={MAX_BIRTH_DATE}
              onChange={(event) => updateField('dateOfBirth', event.target.value)}
              disabled={loading || saving}
            />
          </label>
          <label>
            Phone number (optional)
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={(event) => updateField('phoneNumber', event.target.value)}
              maxLength={25}
              placeholder="+2348012345678"
              disabled={loading || saving}
            />
          </label>
          <label>
            Professional or learner headline
            <input
              value={profile.headline}
              onChange={(event) =>
                updateField('headline', event.target.value)
              }
              placeholder="e.g. Software developer and lifelong learner"
              maxLength={160}
              disabled={loading || saving}
            />
          </label>

          <label>
            Country
            <select
              value={profile.country}
              onChange={(event) =>
                updateField('country', event.target.value)
              }
              disabled={loading || saving}
            >
              <option>Nigeria</option>
              <option>Ghana</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Kenya</option>
              <option>South Africa</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Education or qualification
            <input
              value={profile.education}
              onChange={(event) =>
                updateField('education', event.target.value)
              }
              placeholder="Your education or current programme"
              maxLength={160}
              disabled={loading || saving}
            />
          </label>
        </div>

        <label className="profile-full-field">
          About me
          <textarea
            rows={5}
            value={profile.bio}
            onChange={(event) => updateField('bio', event.target.value)}
            placeholder="Tell the NEXORA learning community about yourself, your experience and your goals."
            maxLength={2000}
            disabled={loading || saving}
          />
        </label>

        <label className="profile-full-field">
          Skills
          <textarea
            rows={3}
            value={profile.skills}
            onChange={(event) => updateField('skills', event.target.value)}
            placeholder="Separate skills with commas"
            maxLength={1000}
            disabled={loading || saving}
          />
        </label>

        <label className="profile-full-field">
          Learning interests
          <textarea
            rows={3}
            value={profile.interests}
            onChange={(event) =>
              updateField('interests', event.target.value)
            }
            placeholder="What would you like to learn?"
            maxLength={1000}
            disabled={loading || saving}
          />
        </label>

        <button
          className="studio-action-button"
          type="submit"
          disabled={loading || saving || !user || !firestoreConfigured}
        >
          {loading
            ? 'Loading profile…'
            : saving
              ? 'Saving profile…'
              : 'Save profile changes'}
        </button>

        {message && (
          <p className="studio-status" role="status">
            {message}
          </p>
        )}
      </form>

      <p className="studio-demo-notice">
        Your profile is private and associated with your authenticated NEXORA
        account. Profile photo uploads and public profile visibility are not
        enabled yet.
      </p>
    </main>
  )
}
