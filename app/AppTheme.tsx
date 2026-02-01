import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/ThemeContext";
import useTheme from "@/hooks/useColorScheme";
import { Check, Desktop, Moon, Sun } from "phosphor-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const AppTheme = () => {
  const { theme, isDark } = useTheme();
  const { mode, setMode } = useThemeContext();
  const { top } = useSafeAreaInsets();

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System Default", icon: Desktop },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: top + 10 },
      ]}
    >
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.title, { color: theme.text }]}>App Theme</Text>
        <View style={{ width: scale(40) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.optionsContainer,
            { backgroundColor: isDark ? colors.neutral800 : colors.white },
          ]}
        >
          {options.map((option, index) => {
            const Icon = option.icon;
            const isSelected = mode === option.id;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? colors.neutral700
                      : colors.neutral200,
                  },
                ]}
                onPress={() =>
                  setMode(option.id as "light" | "dark" | "system")
                }
              >
                <View style={styles.optionLeft}>
                  <Icon size={scale(20)} color={theme.text} />
                  <Text style={[styles.optionLabel, { color: theme.text }]}>
                    {option.label}
                  </Text>
                </View>
                {isSelected && (
                  <Check
                    size={scale(20)}
                    color={colors.primary}
                    weight="bold"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: verticalScale(18),
    fontWeight: "700",
  },
  content: {
    paddingTop: verticalScale(10),
  },
  optionsContainer: {
    borderRadius: scale(16),
    overflow: "hidden",
  }, // Add shadow styles if same as profile
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  optionLabel: {
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
});
