import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const logout = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL: photo });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // JWT and User Data sync
        try {
          const jwtRes = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: currentUser.email });
          localStorage.setItem("access-token", jwtRes.data.token);

          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${currentUser.email}`, {
            headers: { authorization: `Bearer ${jwtRes.data.token}` }
          });
          setRole(userRes.data.role);
          setIsPremium(userRes.data.isPremium);
        } catch (err) {
          console.error("Auth sync error", err);
        }
      } else {
        localStorage.removeItem("access-token");
        setRole(null);
        setIsPremium(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,
    isPremium,
    loading,
    setRole,
    setIsPremium,
    register,
    login,
    googleLogin,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;