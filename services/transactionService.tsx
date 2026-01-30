import { fireStore } from "@/config/firebase";
import {
  getLast12Months,
  getLast7Days,
  getYearsRange,
} from "@/constants/common";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { scale } from "react-native-size-matters";

export const createOrUpdateTransaction = async (
  transaction: TransactionType,
  walletId: string,
  transactionId?: string,
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

// get weekly data
export const getWeeklyData = async (uid: string) => {
  try {
    const db = fireStore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(transactionQuery);

    const weeklyData = getLast7Days(); // [{date, day, income, expense}, ...]
    const transactions: TransactionType[] = [];

    // 1) Loop through all docs and update weeklyData
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date === transactionDate);

      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    // 2) After processing all days, build chart stats
    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        frontColor: colors.primary,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(35),
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("Error fetching weekly data: ", error);
    return { success: false, msg: error.message };
  }
};

// get monthly data
export const getMonthlyData = async (uid: string) => {
  try {
    const db = fireStore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(transactionQuery);

    const monthlyData = getLast12Months(); // [{date, day, income, expense}, ...]
    const transactions: TransactionType[] = [];

    // 1) Loop through all docs and update weeklyData
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const formattedMonthYear = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`,
      );

      if (formattedMonthYear) {
        if (transaction.type === "income") {
          formattedMonthYear.income += transaction.amount;
        } else if (transaction.type === "expense") {
          formattedMonthYear.expense += transaction.amount;
        }
      }
    });

    // 2) After processing all days, build chart stats
    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        frontColor: colors.primary,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(35),
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("Error fetching Monthly data: ", error);
    return { success: false, msg: error.message };
  }
};

// get yearly data
export const getYearlyData = async (uid: string) => {
  try {
    const db = fireStore;

    const transactionQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshot.docs.reduce((prev, curr) => {
      const transactionDate = curr.data().date.toDate();
      return transactionDate < prev ? transactionDate : prev;
    }, new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    // 1) Loop through all docs and update weeklyData
    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const formattedYear = yearlyData.find(
        (year: any) => year.year === transactionYear.toString(),
      );

      if (formattedYear) {
        if (transaction.type === "income") {
          formattedYear.income += transaction.amount;
        } else if (transaction.type === "expense") {
          formattedYear.expense += transaction.amount;
        }
      }
    });

    // 2) After processing all days, build chart stats
    const stats = yearlyData.flatMap((year: any) => [
      {
        value: year.income,
        frontColor: colors.primary,
        label: year.year,
        spacing: scale(4),
        labelWidth: scale(35),
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("Error fetching Yearly data: ", error);
    return { success: false, msg: error.message };
  }
};
