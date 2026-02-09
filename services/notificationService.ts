import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/* 🔹 Notification handler (this part was already OK) */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/* 🔥 REQUIRED: Create Android notification channel */
const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("eco-track", {
      name: "Eco Track",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
};

/* 🔹 Called on app start */
export const processNotifications = async () => {
  // 🔥 MUST be first
  await createNotificationChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission denied");
    return;
  }

  await scheduleDailyReminder();
};

/* 🔹 Daily reminder */
export const scheduleDailyReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Eco Track Reminder 🌿",
      body: "Don't forget to log your daily activities and check your carbon footprint!",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20, // 8:00 PM
      minute: 0,
    },
  });

  console.log("Daily reminder scheduled for 8:00 PM");
};
