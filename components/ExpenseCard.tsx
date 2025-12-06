import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDown, ArrowUp, DotsThreeIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

type ExpenseCardProps = {
  amount?: number;
  income?: number;
  expense?: number;
  loading?: boolean;
};

const ExpenseCard = ({
  amount,
  income,
  expense,
  loading,
}: ExpenseCardProps) => {
  const { isDark, theme } = useTheme();
  return (
    <LinearGradient
      colors={
        isDark ? [colors.neutral800, colors.neutral700] : ["#e5e5e5", "#d4d4d4"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.main}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: verticalScale(16),
            fontWeight: "500",
            color: theme.text,
          }}
        >
          Total Balance
        </Text>
        <DotsThreeIcon size={verticalScale(26)} color={theme.text} />
      </View>
      <Text
        style={{
          fontSize: verticalScale(26),
          fontWeight: "700",
          color: theme.text,
        }}
      >
        Rs {loading ? "..." : amount}
      </Text>

      <View style={styles.summaryRow}>
        {/* Income */}
        <View style={styles.summaryCol}>
          <View style={styles.summaryLabelRow}>
            <View style={styles.iconPillIncome}>
              <ArrowDown
                size={verticalScale(14)}
                color={colors.green}
                weight="bold"
              />
            </View>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>
              Income
            </Text>
          </View>
          <Text style={[styles.summaryAmount, { color: colors.green }]}>
            Rs {loading ? "..." : income}
          </Text>
        </View>

        {/* Expenses */}
        <View style={[styles.summaryCol, styles.summaryColRight]}>
          <View
            style={[styles.summaryLabelRow, { justifyContent: "flex-end" }]}
          >
            <View style={styles.iconPillExpense}>
              <ArrowUp
                size={verticalScale(14)}
                color={colors.rose}
                weight="bold"
              />
            </View>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>
              Expenses
            </Text>
          </View>
          <Text
            style={[
              styles.summaryAmount,
              { color: colors.rose, textAlign: "right" },
            ]}
          >
            Rs {loading ? "..." : expense}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    height: verticalScale(170),
    borderRadius: verticalScale(20),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: verticalScale(30),
    width: "100%",
  },
  summaryCol: {
    flex: 1,
    alignItems: "flex-start",
  },
  summaryColRight: {
    alignItems: "flex-end",
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(6),
    marginBottom: verticalScale(4),
  },
  iconPillIncome: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: "rgba(22, 163, 74, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconPillExpense: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(13),
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: verticalScale(13),
  },
  summaryAmount: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    textAlign: "center",
  },
});
