import { auth, fireStore } from "@/config/firebase";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, Message, ResponseType, UserType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (initializing) {
          await updateUserData(firebaseUser.uid); // ensure user state is set before navigating

          router.replace("/(tabs)");
        }
      } else {
        setUser(null);
        if (initializing) {
          router.replace("/(auth)/welcome");
        }
      }
      setInitializing(false);
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
        password,
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
          budget: data?.budget || 0,
          budgetSetDate: data?.budgetSetDate || null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      let msg = error.message;
    }
  };

  const deleteDataAndAccount = async () => {
    try {
      if (!auth.currentUser)
        return { success: false, msg: "No user logged in" };
      const uid = auth.currentUser.uid;

      // 1. Delete all Firestore Data
      const collectionsToDelete = [
        "wallets",
        "carbon_activities",
        "transactions",
        "electricity_logs",
        "water_logs",
      ];

      for (const colName of collectionsToDelete) {
        try {
          const q = query(
            collection(fireStore, colName),
            where("uid", "==", uid),
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const batchPromises = snapshot.docs.map((docSnap) =>
              deleteDoc(docSnap.ref),
            );
            await Promise.all(batchPromises);
          }
        } catch (colError: any) {
          console.error(`Failed to delete items in ${colName}:`, colError);
        }
      }

      // 2. Delete User Tips Doc
      await deleteDoc(doc(fireStore, "user_tips", uid));

      // 2. Delete User Profile Doc
      await deleteDoc(doc(fireStore, "users", uid));

      // 3. Delete Auth Account
      await deleteUser(auth.currentUser);

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting account:", error);
      let msg = error.message;
      if (error.code === "auth/requires-recent-login") {
        msg =
          "For security reasons, please sign out and sign back in before deleting your account.";
      }
      return { success: false, msg };
    }
  };

  const updateBudget = async (budget: number): Promise<ResponseType> => {
    try {
      if (!user?.uid) return { success: false, msg: "User not found" };
      const budgetSetDate = new Date();
      await updateDoc(doc(fireStore, "users", user.uid), {
        budget,
        budgetSetDate,
      });
      setUser((prev) => (prev ? { ...prev, budget, budgetSetDate } : null));
      return { success: true };
    } catch (e: any) {
      return { success: false, msg: e.message };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
    updateBudget,
    deleteDataAndAccount,
    messages,
    setMessages,
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
