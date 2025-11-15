import { auth, fireStore } from "@/config/firebase";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });

        if (initializing) {
          updateUserData(firebaseUser.uid);
          router.replace("/(tabs)");
        }
      } else {
        setUser(null);

        if (initializing) {
          router.replace("/(auth)/welcome");
        }
      }

      if (initializing) setInitializing(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      switch (msg) {
        case "Firebase: Error (auth/invalid-credential).":
          msg = "Incorrect email or password. Please try again.";
          break;
        case "Firebase: Error (auth/invalid-email).":
          msg = "Invalid email address";
          break;
        default:
          msg = "Failed to login. Please try again.";
          break;
      }

      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(fireStore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      switch (msg) {
        case "Firebase: Error (auth/email-already-in-use).":
          msg = "Email already in use";
          break;
        case "Firebase: Password should be at least 6 characters (auth/weak-password).":
          msg = "Password should be at least 6 characters";
          break;
        case "Firebase: Error (auth/invalid-email).":
          msg = "Invalid email address";
          break;
        default:
          msg = "Failed to create account. Please try again.";
          break;
      }
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(fireStore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid || null,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      let msg = error.message;
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,

  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
