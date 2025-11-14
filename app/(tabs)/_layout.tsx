import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ChartBar,
  CurrencyDollar,
  House,
  UserCircle,
  Wallet,
} from "phosphor-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
const _layout = () => {
  const { bottom } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  return (
    <>
      <StatusBar style="auto" animated />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: moderateScale(10),
            paddingBottom: bottom + moderateScale(45),
            backgroundColor: isDark ? colors.neutral800 : colors.white,
            borderTopColor: isDark ? colors.neutral800 : colors.white,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ size, color, focused }) => (
              <House
                size={35}
                color={focused ? colors.primary : "gray"}
                weight="fill"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ size, color, focused }) => (
              <CurrencyDollar
                size={35}
                color={focused ? colors.primary : "gray"}
                weight="fill"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ size, color, focused }) => (
              <ChartBar
                size={35}
                color={focused ? colors.primary : "gray"}
                weight="fill"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ size, color, focused }) => (
              <Wallet
                size={35}
                color={focused ? colors.primary : "gray"}
                weight="fill"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color, focused }) => (
              <UserCircle
                size={35}
                color={focused ? colors.primary : "gray"}
                weight="fill"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;
