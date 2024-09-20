import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0o1QAfiwGLgUolH1szObxcqMW7-qle-M",
  authDomain: "sperax-app.firebaseapp.com",
  projectId: "sperax-app",
  storageBucket: "sperax-app.appspot.com",
  messagingSenderId: "557311194400",
  appId: "1:557311194400:web:1f53073103bed61a1c1345",
  measurementId: "G-EPVVRESJWY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, provider, db };