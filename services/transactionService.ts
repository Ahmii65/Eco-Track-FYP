import { fireStore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const createOrUpdateTransaction = async (
  transaction: TransactionType,
  walletId: string,
  transactionId?: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    let newAmount = walletData.amount || 0;
    let newTotalIncome = walletData.totalIncome || 0;
    let newTotalExpenses = walletData.totalExpenses || 0;

    if (transactionId) {
      // Update existing transaction
      const transactionRef = doc(fireStore, "transactions", transactionId);
      const transactionSnapshot = await getDoc(transactionRef);

      if (!transactionSnapshot.exists()) {
        return { success: false, msg: "Transaction not found" };
      }

      const oldTransaction = transactionSnapshot.data() as TransactionType;

      // Reverse old transaction effect
      if (oldTransaction.type === "income") {
        newAmount -= oldTransaction.amount;
        newTotalIncome -= oldTransaction.amount;
      } else {
        newAmount += oldTransaction.amount;
        newTotalExpenses -= oldTransaction.amount;
      }

      // Apply new transaction effect
      if (transaction.type === "income") {
        newAmount += transaction.amount;
        newTotalIncome += transaction.amount;
      } else {
        newAmount -= transaction.amount;
        newTotalExpenses += transaction.amount;
      }

      if (newAmount < 0) {
        return { success: false, msg: "Amount not available" };
      }

      await updateDoc(transactionRef, {
        ...transaction,
        date: Timestamp.fromDate(transaction.date as Date),
      });
    } else {
      // Create new transaction
      // Apply new transaction effect
      if (transaction.type === "income") {
        newAmount += transaction.amount;
        newTotalIncome += transaction.amount;
      } else {
        newAmount -= transaction.amount;
        newTotalExpenses += transaction.amount;
      }

      if (newAmount < 0) {
        return { success: false, msg: "Amount not available" };
      }

      await addDoc(collection(fireStore, "transactions"), {
        ...transaction,
        date: Timestamp.fromDate(transaction.date as Date),
      });
    }

    // Update wallet document
    await updateDoc(walletRef, {
      amount: newAmount,
      totalIncome: newTotalIncome,
      totalExpenses: newTotalExpenses,
    });

    return {
      success: true,
      msg: transactionId
        ? "Transaction updated successfully"
        : "Transaction added successfully",
    };
  } catch (error: any) {
    console.log("Error saving transaction: ", error);
    return {
      success: false,
      msg: error.message || "Failed to save transaction",
    };
  }
};

export const delTransaction = async (transactionId: string) => {
  try {
    const transactionRef = doc(fireStore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;
    const walletId = transactionData.walletId;

    const walletRef = doc(fireStore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;
    let newAmount = walletData.amount || 0;
    let newTotalIncome = walletData.totalIncome || 0;
    let newTotalExpenses = walletData.totalExpenses || 0;

    if (transactionData.type === "income") {
      newAmount -= transactionData.amount;
      newTotalIncome -= transactionData.amount;
    } else {
      newAmount += transactionData.amount;
      newTotalExpenses -= transactionData.amount;
    }

    await updateDoc(walletRef, {
      amount: newAmount,
      totalIncome: newTotalIncome,
      totalExpenses: newTotalExpenses,
    });

    await deleteDoc(transactionRef);
    return { success: true, msg: "Transaction deleted successfully" };
  } catch (error: any) {
    console.log("Error deleting transaction: ", error);
    return {
      success: false,
      msg: error.message || "Failed to delete transaction",
    };
  }
};
