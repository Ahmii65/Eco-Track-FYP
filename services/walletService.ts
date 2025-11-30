import { fireStore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { uploadToCloudinary } from "./imageServices";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
      let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadToCloudinary(
        walletData.image,
        "wallets"
      );
      walletToSave.image = imageUploadRes.data;
    }
    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.totalIncome = 0;
      walletToSave.created = new Date();
    }
    const walletRef = walletData?.id
      ? doc(fireStore, "wallets", walletData?.id)
      : doc(collection(fireStore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("Error creating or Updaing wallet ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string) => {
  try {
    const transactionsRef = collection(fireStore, "transactions");
    const q = query(transactionsRef, where("walletId", "==", walletId));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(fireStore);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(doc(fireStore, "wallets", walletId));

    await batch.commit();
    router.back();
    // return { success: true, msg: "Wallet and associated transactions deleted" };
  } catch (error: any) {
    console.log("Error deleting wallet: ", error);
    return { success: false, msg: error.message };
  }
};
