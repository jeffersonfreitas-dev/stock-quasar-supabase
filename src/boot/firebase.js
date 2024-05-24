import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'FIREBASE_APIKEY',
  authDomain: 'stockset-1ac85.firebaseapp.com',
  projectId: 'FIREBASE_PROJECTID',
  storageBucket: 'FIREBASE_STORAGE',
  appId: 'FIREBASE_APPID'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage()

export {
  db,
  storage
}
