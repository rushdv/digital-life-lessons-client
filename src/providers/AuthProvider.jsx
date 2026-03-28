import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // Sync premium status from MongoDB
  const syncUserStatus = async (currentUser) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/status/${currentUser.email}`
      );
      setIsPremium(res.data.isPremium);
    } catch (err) {
      setIsPremium(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save JWT token
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/jwt`,
          { email: currentUser.email }
        );
        localStorage.setItem("access-token", res.data.token);
        await syncUserStatus(currentUser);
      } else {
        localStorage.removeItem("access-token");
        setIsPremium(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    isPremium,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
    syncUserStatus,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;