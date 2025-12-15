import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { TransactionItemProps } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const TransactionListItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const { theme, isDark } = useTheme();

  let category =
    item.type === "income" ? incomeCategory : expenseCategories[item.category!];

  const IconComponent = category.icon;
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
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          <IconComponent
            size={verticalScale(25)}
            weight="fill"
            color={colors.white}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "400", color: theme.text }}>
            {category.label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isDark ? colors.neutral500 : "gray",
            }}
            numberOfLines={1}
          >
            {item.description}
          </Text>
        </View>
        <View style={{ paddingRight: 4, alignItems: "flex-end" }}>
          <Text
            style={{
              color: item.type == "income" ? colors.green : colors.rose,
              fontSize: verticalScale(14),
              fontWeight: "600",
            }}
          >
            {item.type == "income" ? "+ " : "- "}Rs {item.amount}
          </Text>
          <Text style={{ color: isDark ? colors.neutral500 : "gray" }}>
            {item.date?.toDate?.()?.toLocaleDateString() || "Date"}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionListItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(10),
    padding: verticalScale(10),
    borderRadius: verticalScale(17),
  },
  icon: {
    padding: verticalScale(10),
    borderRadius: verticalScale(15),
    aspectRatio: 1,
    alignItems: "center",
    borderCurve: "continuous",
  },
});
