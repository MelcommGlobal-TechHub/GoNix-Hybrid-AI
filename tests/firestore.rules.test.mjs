import { readFileSync } from 'node:fs'
import {
  after,
  before,
  beforeEach,
  test,
} from 'node:test'

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing'

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

let testEnv

const projectId = 'demo-nexora-rules'

const profile = (createdAt = serverTimestamp()) => ({
  displayName: 'NEXORA Test User',
  headline: 'Software developer',
  country: 'Nigeria',
  education: 'Technology',
  bio: 'A test profile.',
  skills: 'React, TypeScript',
  interests: 'Artificial Intelligence',
  createdAt,
  updatedAt: serverTimestamp(),
})

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

after(async () => {
  await testEnv.cleanup()
})

test('unauthenticated users cannot read profiles', async () => {
  const db = testEnv.unauthenticatedContext().firestore()

  await assertFails(
    getDoc(doc(db, 'users', 'user-a')),
  )
})

test('unverified users cannot read or create profiles', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertFails(
    getDoc(doc(db, 'users', 'user-a')),
  )

  await assertFails(
    setDoc(doc(db, 'users', 'user-a'), profile()),
  )
})

test('verified users can create their own profile', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertSucceeds(
    setDoc(doc(db, 'users', 'user-a'), profile()),
  )
})

test('verified users can read their own profile', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), 'users', 'user-a'),
      profile(),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertSucceeds(
    getDoc(doc(db, 'users', 'user-a')),
  )
})

test('users cannot read another user profile', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), 'users', 'user-b'),
      profile(),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertFails(
    getDoc(doc(db, 'users', 'user-b')),
  )
})

test('users cannot list the user collection', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertFails(
    getDocs(collection(db, 'users')),
  )
})

test('verified users can update their own profile', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const { Timestamp } = await import('firebase/firestore')

    await setDoc(
      doc(context.firestore(), 'users', 'user-a'),
      profile(Timestamp.now()),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertSucceeds(
    updateDoc(doc(db, 'users', 'user-a'), {
      headline: 'Updated developer profile',
      updatedAt: serverTimestamp(),
    }),
  )
})

test('users cannot change the creation timestamp', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const { Timestamp } = await import('firebase/firestore')

    await setDoc(
      doc(context.firestore(), 'users', 'user-a'),
      profile(Timestamp.fromMillis(1000)),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertFails(
    updateDoc(doc(db, 'users', 'user-a'), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  )
})

test('users cannot add unauthorized profile fields', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertFails(
    setDoc(doc(db, 'users', 'user-a'), {
      ...profile(),
      isAdmin: true,
    }),
  )
})

test('users cannot delete their profiles', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), 'users', 'user-a'),
      profile(),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: true })
    .firestore()

  await assertFails(
    deleteDoc(doc(db, 'users', 'user-a')),
  )
})


const initialRegistrationProfile = () => ({
  ...profile(),
  dateOfBirth: Timestamp.fromDate(new Date('1990-04-12T00:00:00.000Z')),
  phoneNumber: '',
})

test('unverified email users can create their own initial registration profile', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertSucceeds(
    setDoc(
      doc(db, 'users', 'user-a'),
      initialRegistrationProfile(),
    ),
  )
})

test('unverified users cannot read their newly created registration profile', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertSucceeds(
    setDoc(
      doc(db, 'users', 'user-a'),
      initialRegistrationProfile(),
    ),
  )

  await assertFails(
    getDoc(doc(db, 'users', 'user-a')),
  )
})

test('unverified users cannot update an existing profile', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), 'users', 'user-a'),
      initialRegistrationProfile(),
    )
  })

  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertFails(
    updateDoc(doc(db, 'users', 'user-a'), {
      headline: 'Attempted unverified update',
      updatedAt: serverTimestamp(),
    }),
  )
})

test('unverified users cannot create an initial profile without date of birth', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertFails(
    setDoc(
      doc(db, 'users', 'user-a'),
      profile(),
    ),
  )
})

test('unverified users cannot create a profile for another user', async () => {
  const db = testEnv
    .authenticatedContext('user-a', { email_verified: false })
    .firestore()

  await assertFails(
    setDoc(
      doc(db, 'users', 'user-b'),
      initialRegistrationProfile(),
    ),
  )
})

test('verified Google users can create a profile without date of birth', async () => {
  const db = testEnv
    .authenticatedContext('google-user', { email_verified: true })
    .firestore()

  await assertSucceeds(
    setDoc(
      doc(db, 'users', 'google-user'),
      profile(),
    ),
  )
})


test('future DOB timestamps are rejected', async () => {
  const db = testEnv
    .authenticatedContext('future-user', { email_verified: false })
    .firestore()

  const futureProfile = {
    ...initialRegistrationProfile(),
    dateOfBirth: Timestamp.fromDate(
      new Date('2999-01-01T00:00:00.000Z'),
    ),
  }

  await assertFails(
    setDoc(doc(db, 'users', 'future-user'), futureProfile),
  )
})

test('string DOB values are rejected for unverified registration', async () => {
  const db = testEnv
    .authenticatedContext('string-dob-user', { email_verified: false })
    .firestore()

  await assertFails(
    setDoc(doc(db, 'users', 'string-dob-user'), {
      ...profile(),
      dateOfBirth: '1990-04-12',
      phoneNumber: '',
    }),
  )
})

test('valid international phone numbers are accepted', async () => {
  const db = testEnv
    .authenticatedContext('phone-user', { email_verified: false })
    .firestore()

  await assertSucceeds(
    setDoc(doc(db, 'users', 'phone-user'), {
      ...initialRegistrationProfile(),
      phoneNumber: '+2348012345678',
    }),
  )
})

test('invalid international phone numbers are rejected', async () => {
  const db = testEnv
    .authenticatedContext('bad-phone-user', { email_verified: false })
    .firestore()

  await assertFails(
    setDoc(doc(db, 'users', 'bad-phone-user'), {
      ...initialRegistrationProfile(),
      phoneNumber: '08012345678',
    }),
  )
})
