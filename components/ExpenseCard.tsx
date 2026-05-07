import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDown, ArrowUp, Warning } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

type ExpenseCardProps = {
  amount?: number;
  income?: number;
  expense?: number;
  loading?: boolean;
  budget?: number;
  onEditBudget?: () => void;
  budgetExpense?: number;
};

const ExpenseCard = ({
  amount,
  income,
  expense,
  loading,
  budget = 0,
  onEditBudget,
  budgetExpense,
}: ExpenseCardProps) => {
  const { isDark, theme } = useTheme();

  // Calculate Progress
  const totalExpense =
    budgetExpense !== undefined ? budgetExpense : expense || 0;
  const progress = budget > 0 ? totalExpense / budget : 0;
  const percent = Math.min(progress * 100, 100);

  // Color Logic
  let progressColor = colors.green;
  if (progress >= 1) progressColor = colors.rose;
  else if (progress >= 0.8) progressColor = "#f97316"; // Orange

  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    if (progress >= 1) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [progress]);

  return (
    <View>
      <LinearGradient
        colors={
          isDark
            ? [colors.neutral800, colors.neutral700]
            : ["#e5e5e5", "#d4d4d4"]
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

        {/* Budget Section */}
        <View style={{ marginTop: verticalScale(10) }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: verticalScale(5),
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: verticalScale(12),
                fontWeight: "500",
              }}
            >
              Budget: Rs {budget}
            </Text>
            {onEditBudget && (
              <Text
                onPress={onEditBudget}
                style={{
                  color: isDark ? colors.primary : colors.neutral800,
                  fontSize: verticalScale(12),
                  fontWeight: "700",
                }}
              >
                Edit
              </Text>
            )}
          </View>

          {/* Progress Bar Background */}
          <View
            style={{
              height: verticalScale(6),
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Fill */}
            <View
              style={{
                width: `${percent}%`,
                height: "100%",
                backgroundColor: progressColor,
              }}
            />
          </View>
        </View>

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
      {showWarning && (
        <View
          style={[
            styles.warning,
            {
              backgroundColor: isDark ? colors.neutral800 : colors.neutral300,
              justifyContent: "space-between",
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Warning weight="fill" color={"yellow"} />
            <Text
              style={{
                color: theme.text,
                fontSize: verticalScale(12),
                fontWeight: "500",
              }}
            >
              Budget Limit Reached!
            </Text>
          </View>
          <Text
            onPress={() => setShowWarning(false)}
            style={{
              color: isDark ? colors.primary : colors.neutral500,
              fontSize: verticalScale(12),
              fontWeight: "500",
            }}
          >
            Tap to hide
          </Text>
        </View>
      )}
    </View>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    height: verticalScale(220),
    borderRadius: verticalScale(20),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
  },
  warning: {
    minHeight: verticalScale(50),
    marginTop: verticalScale(15),
    overflow: "hidden",
    borderRadius: verticalScale(20),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(20),
    gap: scale(5),
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
