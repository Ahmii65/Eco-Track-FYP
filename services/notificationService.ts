import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const processNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return;
  }

  // Schedule daily reminder if permissions granted
  await scheduleDailyReminder();
};

export const scheduleDailyReminder = async () => {
  // Cancel all existing to avoid duplicates (safeguard)
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Eco Track Reminder 🌿",
      body: "Don't forget to log your daily activities and check your carbon footprint!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20, // 8:00 PM
      minute: 0,
    },
  });

  console.log("Daily reminder scheduled for 8:00 PM");
};
