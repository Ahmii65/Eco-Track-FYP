import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { CarbonActivityType } from "@/types";
import { Leaf } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

import { cfpCategories } from "@/constants/cfpData";

type Props = {
  item: CarbonActivityType;
  index: number;
  handleClick: (item: CarbonActivityType) => void;
};

const CarbonActivityItem = ({ item, index, handleClick }: Props) => {
  const { theme, isDark } = useTheme();

  // Find category details from constants
  const catDetails = cfpCategories.find((c) => c.value === item.category);

  // Fallback defaults
  const IconComponent = catDetails?.icon || Leaf;
  const color = catDetails?.color || colors.neutral500;
  const label = catDetails?.label || "Activity";

  // Handle date conversion safely
  const dateObj =
    item.date && (item.date as any).toDate
      ? (item.date as any).toDate()
      : new Date(item.date as any);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(18)
        .mass(0.7)
        .stiffness(90)}
    >
      <TouchableOpacity
        style={[
          styles.row,
          { backgroundColor: isDark ? colors.neutral800 : colors.neutral200 },
        ]}
        onPress={() => handleClick(item)}
      >
        <View style={[styles.icon, { backgroundColor: color + "20" }]}>
          <IconComponent size={verticalScale(25)} weight="fill" color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "500", color: theme.text }}>
            {item.title || label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isDark ? colors.neutral500 : "gray",
            }}
          >
            {label}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: colors.rose, // Carbon is always "bad" or "cost"
              fontSize: verticalScale(14),
              fontWeight: "600",
            }}
          >
            {item.impact} kg
          </Text>
          <Text style={{ color: isDark ? colors.neutral500 : "gray" }}>
            {dateObj.toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CarbonActivityItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(14),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: verticalScale(20),

    // Premium Item Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    padding: verticalScale(12),
    borderRadius: verticalScale(18),
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
