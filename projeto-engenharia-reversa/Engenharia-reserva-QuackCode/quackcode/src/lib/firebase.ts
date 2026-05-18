import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const remoteConfig = getRemoteConfig(app);

// Remote Config setup
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
  "github_url": "https://github.com/mgj240819/QuackCode",
  "npm_url": "https://www.npmjs.com/package/qr-code-styling",
  "welcome_message": "Welcome to QuackCode!"
};

// Auth helpers
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create/update user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Firestore helpers
export const saveQRCode = async (userId: string, name: string, data: string, options: any) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "qrcodes"), {
      userId,
      name,
      data,
      options,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving QR code:", error);
    throw error;
  }
};

// Storage helpers
export const uploadLogo = async (userId: string, file: File) => {
  try {
    const storageRef = ref(storage, `users/${userId}/logos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading logo:", error);
    throw error;
  }
};

// Remote Config helper
export const getRemoteConfigValue = async (key: string) => {
  await fetchAndActivate(remoteConfig);
  return getValue(remoteConfig, key).asString();
};
