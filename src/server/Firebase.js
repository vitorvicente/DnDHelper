import { initializeApp } from "firebase/app"
import { collection, doc, getFirestore, getDoc, updateDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWiUHWHAPft5TJZ7RbteUSr5pdvMIqs_c",
  authDomain: "vtr-pt.firebaseapp.com",
  databaseURL: "https://vtr-pt.firebaseio.com",
  projectId: "vtr-pt",
  storageBucket: "vtr-pt.appspot.com",
  messagingSenderId: "363782155278",
  appId: "1:363782155278:web:f1ddc12e60b1572a46205f",
  measurementId: "G-HRV72PCP57"
};

class Firebase {
  constructor(app) {
    app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.firestore = getFirestore(app);
  }

  createUser = (email, password) => createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmail = (email, password) => signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () =>
    signOut(this.auth).then(() => localStorage.removeItem("authUser"));

  // *** Merge Auth and DB User API ***
  onAuthUserListener = (next, fallback) =>
    onAuthStateChanged(this.auth, (authUser) => {
      if (authUser) {
        getDoc(this.user(authUser.uid)).then(async (snapshot) => {
          if (snapshot.exists) {
            const dbUser = snapshot.data();
            // eslint-disable-next-line no-prototype-builtins
            if (!dbUser.hasOwnProperty("roles")) {
              dbUser.roles = {
                guest: true,
              };

              await updateDoc(this.user(authUser.uid), dbUser);
            }

            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          } else {
            const dbUser = {
              roles: {
                guest: true,
              },
            };

            setDoc(this.user(authUser.uid), dbUser).then(() => {
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser,
              };

              next(authUser);
            });
          }
        }).catch(console.error);
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = (uid) => doc(this.firestore, "users", uid);
  users = () => collection(this.firestore, "users");

  // *** Config API ***
  config = (config) => doc(this.firestore, "config", config)
}

export default Firebase;