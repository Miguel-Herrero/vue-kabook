import { initializeApp } from 'firebase'
// Required for side-effects
require('firebase/firestore')

const firebase = initializeApp({
  apiKey: 'AIzaSyDMtTMsu34Z4T-YFKs2zlWnhecgMi9YptQ',
  authDomain: 'api-project-875720539301.firebaseapp.com',
  databaseURL: 'https://api-project-875720539301.firebaseio.com',
  projectId: 'api-project-875720539301',
  storageBucket: 'api-project-875720539301.appspot.com',
  messagingSenderId: '875720539301'
})

// Initialize Cloud Firestore through Firebase
export const db = firebase.firestore()
export const booksRef = db.collection('books')
export const authorsRef = db.collection('authors')
export const tagsRef = db.collection('tags')

export const dbRT = firebase.database()
export const namesRef = dbRT.ref('names')
