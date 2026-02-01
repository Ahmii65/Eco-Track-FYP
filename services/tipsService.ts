import { fireStore } from "@/config/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const fetchUserAppliedTips = async (uid: string): Promise<string[]> => {
  try {
    const userTipsRef = doc(fireStore, "user_tips", uid);
    const docSnap = await getDoc(userTipsRef);

    if (docSnap.exists()) {
      return docSnap.data().appliedTips || [];
    } else {
      // If doc doesn't exist, return empty and optionally create it lazily later
      return [];
    }
  } catch (error) {
    console.error("Error fetching user tips:", error);
    return [];
  }
};

export const toggleTipStatus = async (
  uid: string,
  tipId: string,
  isApplied: boolean,
): Promise<{ success: boolean; msg?: string }> => {
  try {
    const userTipsRef = doc(fireStore, "user_tips", uid);
    const docSnap = await getDoc(userTipsRef);

    if (!docSnap.exists()) {
      // Create document if it doesn't exist
      await setDoc(userTipsRef, {
        appliedTips: isApplied ? [tipId] : [],
      });
      return { success: true };
    }

    // Update existing document
    await updateDoc(userTipsRef, {
      appliedTips: isApplied ? arrayUnion(tipId) : arrayRemove(tipId),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling tip status:", error);
    return { success: false, msg: error.message };
  }
};
