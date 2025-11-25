import { fireStore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { router } from "expo-router";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
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
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || " Failed to upload image",
        };
      }
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
    // console.log("Error creating or Updaing wallet ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string) => {
  await deleteDoc(doc(fireStore, "wallets", walletId));
  router.back();
  // console.log("wallet deleted");
};
