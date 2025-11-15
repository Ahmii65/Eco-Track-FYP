import AnimatedTabIcons from "@/components/AnimatedTabIcons";
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
import { moderateScale } from "react-native-size-matters";
const _layout = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style="auto" animated />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: moderateScale(8),
            backgroundColor: isDark ? colors.neutral800 : colors.white,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ size, focused }) => (
              <AnimatedTabIcons
                size={size}
                color={focused ? colors.primary : "gray"}
                focused={focused}
                Icon={House}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcons
                size={size}
                color={focused ? colors.primary : "gray"}
                focused={focused}
                Icon={CurrencyDollar}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Statistics"
          options={{
            title: "Statistics",
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcons
                size={size}
                color={focused ? colors.primary : "gray"}
                focused={focused}
                Icon={ChartBar}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcons
                size={size}
                color={focused ? colors.primary : "gray"}
                focused={focused}
                Icon={Wallet}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcons
                size={size}
                color={focused ? colors.primary : "gray"}
                focused={focused}
                Icon={UserCircle}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;
