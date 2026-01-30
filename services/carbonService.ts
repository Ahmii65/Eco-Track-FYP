import { fireStore } from "@/config/firebase";
import {
  getLast12Months,
  getLast7Days,
  getYearsRange,
} from "@/constants/common";
import { colors } from "@/constants/theme";
import { CarbonActivityType, ResponseType } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { scale } from "react-native-size-matters";

export const createOrUpdateActivity = async (
  activity: CarbonActivityType,
  activityId?: string,
): Promise<ResponseType> => {
  try {
    const activityData = {
      ...activity,
      date: Timestamp.fromDate(activity.date as Date),
    };

    if (activityId) {
      const activityRef = doc(fireStore, "carbon_activities", activityId);
      await updateDoc(activityRef, activityData);
      return { success: true, msg: "Activity updated successfully" };
    } else {
      await addDoc(collection(fireStore, "carbon_activities"), activityData);
      return { success: true, msg: "Activity added successfully" };
    }
  } catch (error: any) {
    console.log("Error saving activity: ", error);
    return {
      success: false,
      msg: error.message || "Failed to save activity",
    };
  }
};

export const deleteActivity = async (
  activityId: string,
): Promise<ResponseType> => {
  try {
    const activityRef = doc(fireStore, "carbon_activities", activityId);
    await deleteDoc(activityRef);
    return { success: true, msg: "Activity deleted successfully" };
  } catch (error: any) {
    console.log("Error deleting activity: ", error);
    return {
      success: false,
      msg: error.message || "Failed to delete activity",
    };
  }
};

export const createOrUpdateWaterLog = async (
  log: any,
  logId?: string,
): Promise<ResponseType> => {
  try {
    const logData = {
      ...log,
      date: Timestamp.fromDate(log.date as Date),
    };

    if (logId) {
      const logRef = doc(fireStore, "water_logs", logId);
      await updateDoc(logRef, logData);
      return { success: true, msg: "Water log updated successfully" };
    } else {
      await addDoc(collection(fireStore, "water_logs"), logData);
      return { success: true, msg: "Water log added successfully" };
    }
  } catch (error: any) {
    console.log("Error saving water log: ", error);
    return {
      success: false,
      msg: error.message || "Failed to save water log",
    };
  }
};

export const deleteWaterLog = async (logId: string): Promise<ResponseType> => {
  try {
    const logRef = doc(fireStore, "water_logs", logId);
    await deleteDoc(logRef);
    return { success: true, msg: "Water log deleted successfully" };
  } catch (error: any) {
    console.log("Error deleting water log: ", error);
    return {
      success: false,
      msg: error.message || "Failed to delete water log",
    };
  }
};

export const createOrUpdateElectricityLog = async (
  log: any,
  logId?: string,
): Promise<ResponseType> => {
  try {
    const logData = {
      ...log,
      date: Timestamp.fromDate(log.date as Date),
    };

    if (logId) {
      const logRef = doc(fireStore, "electricity_logs", logId);
      await updateDoc(logRef, logData);
      return { success: true, msg: "Electricity log updated successfully" };
    } else {
      await addDoc(collection(fireStore, "electricity_logs"), logData);
      return { success: true, msg: "Electricity log added successfully" };
    }
  } catch (error: any) {
    console.log("Error saving electricity log: ", error);
    return {
      success: false,
      msg: error.message || "Failed to save electricity log",
    };
  }
};

export const deleteElectricityLog = async (
  logId: string,
): Promise<ResponseType> => {
  try {
    const logRef = doc(fireStore, "electricity_logs", logId);
    await deleteDoc(logRef);
    return { success: true, msg: "Electricity log deleted successfully" };
  } catch (error: any) {
    console.log("Error deleting electricity log: ", error);
    return {
      success: false,
      msg: error.message || "Failed to delete electricity log",
    };
  }
};

// --- Aggregation Functions ---

export const getWeeklyCarbonData = async (uid: string) => {
  try {
    const db = fireStore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const q = query(
      collection(db, "carbon_activities"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(q);

    const weeklyData = getLast7Days();
    const activities: CarbonActivityType[] = [];

    querySnapshot.forEach((doc) => {
      const activity = doc.data() as CarbonActivityType;
      activity.id = doc.id;
      activities.push(activity);

      const activityDate = (activity.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date === activityDate);

      // Map impact to income (offsets) and expense (emissions)
      if (dayData) {
        const impact = activity.impact || 0;
        if (impact < 0) {
          dayData.income += Math.abs(impact);
        } else {
          dayData.expense += impact;
        }
      }
    });

    // Build chart stats with dual bars
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

    return { success: true, data: { stats, activities } };
  } catch (error: any) {
    console.log("Error fetching weekly carbon data: ", error);
    return { success: false, msg: error.message };
  }
};

export const getMonthlyCarbonData = async (uid: string) => {
  try {
    const db = fireStore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const q = query(
      collection(db, "carbon_activities"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(q);

    const monthlyData = getLast12Months();
    const activities: CarbonActivityType[] = [];

    querySnapshot.forEach((doc) => {
      const activity = doc.data() as CarbonActivityType;
      activity.id = doc.id;
      activities.push(activity);

      const date = (activity.date as Timestamp).toDate();
      const monthName = date.toLocaleString("default", { month: "short" });
      const shortYear = date.getFullYear().toString().slice(-2);
      const key = `${monthName} ${shortYear}`;

      const monthData = monthlyData.find((m) => m.month === key);
      if (monthData) {
        const impact = activity.impact || 0;
        if (impact < 0) {
          monthData.income += Math.abs(impact);
        } else {
          monthData.expense += impact;
        }
      }
    });

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

    return { success: true, data: { stats, activities } };
  } catch (error: any) {
    console.log("Error fetching monthly carbon data: ", error);
    return { success: false, msg: error.message };
  }
};

export const getYearlyCarbonData = async (uid: string) => {
  try {
    const db = fireStore;
    const q = query(
      collection(db, "carbon_activities"),
      where("uid", "==", uid),
      orderBy("date", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const activities: CarbonActivityType[] = [];

    if (querySnapshot.empty) {
      return { success: true, data: { stats: [], activities: [] } };
    }

    const dates = querySnapshot.docs.map((d) => d.data().date.toDate());
    const minDate = new Date(Math.min(...dates.map((d: any) => d.getTime())));
    const firstYear = minDate.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    querySnapshot.forEach((doc) => {
      const activity = doc.data() as CarbonActivityType;
      activity.id = doc.id;
      activities.push(activity);

      const year = (activity.date as Timestamp)
        .toDate()
        .getFullYear()
        .toString();
      const yearData = yearlyData.find((y: any) => y.year === year);

      if (yearData) {
        const impact = activity.impact || 0;
        if (impact < 0) {
          yearData.income += Math.abs(impact);
        } else {
          yearData.expense += impact;
        }
      }
    });

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

    return { success: true, data: { stats, activities } };
  } catch (error: any) {
    console.log("Error fetching yearly carbon data: ", error);
    return { success: false, msg: error.message };
  }
};
