import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="Expenses" options={{ title: "Expenses" }} />
      <Tabs.Screen name="Statistics" options={{ title: "Statistics" }} />
      <Tabs.Screen name="Wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default _layout;
