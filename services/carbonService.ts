import { fireStore } from "@/config/firebase";
import { CarbonActivityType, ResponseType } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

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
