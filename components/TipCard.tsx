import { colors } from "@/constants/theme";
import { TipType } from "@/constants/tipsData";
import useTheme from "@/hooks/useColorScheme";
import { CheckCircle } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

type Props = {
  item: TipType;
  isApplied: boolean;
  onApply: (id: string) => void;
  index: number;
};

const getCategoryColor = (category: string, isDark: boolean) => {
  switch (category) {
    case "Transport":
      return isDark ? "#3B82F6" : "#E0F2FE"; // Blue
    case "Energy":
      return isDark ? "#EAB308" : "#FEF9C3"; // Yellow
    case "Food":
      return isDark ? "#22C55E" : "#DCFCE7"; // Green
    case "Spending":
      return isDark ? "#A855F7" : "#F3E8FF"; // Purple
    default:
      return isDark ? "#64748B" : "#F1F5F9";
  }
};

const getCategoryTextColor = (category: string, isDark: boolean) => {
  switch (category) {
    case "Transport":
      return isDark ? "#93C5FD" : "#0369A1"; // Blue
    case "Energy":
      return isDark ? "#FDE047" : "#854D0E"; // Yellow
    case "Food":
      return isDark ? "#86EFAC" : "#15803D"; // Green
    case "Spending":
      return isDark ? "#D8B4FE" : "#6B21A8"; // Purple
    default:
      return isDark ? "#CBD5E1" : "#334155";
  }
};

const TipCard = ({ item, isApplied, onApply, index }: Props) => {
  const { theme, isDark } = useTheme();

  const Icon = item.icon;
  const scaleAnim = useSharedValue(1);

  const handlePress = () => {
    scaleAnim.value = withSpring(0.95, {}, () => {
      scaleAnim.value = withSpring(1);
    });
    onApply(item.id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const cardBg = isDark ? colors.neutral800 : colors.white;
  const borderColor = isApplied
    ? colors.primary
    : isDark
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.05)";

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).springify()}
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor: borderColor,
          shadowColor: isDark ? "#000" : "#ccc",
          shadowOpacity: isDark ? 0.3 : 0.1,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isDark ? "#333" : "#f0fdf4" },
          ]}
        >
          <Icon
            size={scale(24)}
            color={isDark ? colors.white : colors.primary}
            weight="fill"
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.category,
              { color: getCategoryTextColor(item.category, isDark) },
            ]}
          >
            {item.category}
          </Text>
        </View>
        <View style={styles.impactBadge}>
          <Text style={styles.impactText}>{item.points} pts</Text>
        </View>
      </View>

      <Text
        style={[styles.description, { color: isDark ? "#A0A0A0" : "#666" }]}
      >
        {item.description}
      </Text>

      <View style={styles.footer}>
        {item.impactLabel && (
          <View
            style={[
              styles.tag,
              { backgroundColor: getCategoryColor(item.category, isDark) },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: getCategoryTextColor(item.category, isDark) },
              ]}
            >
              {item.impactLabel}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handlePress} style={styles.actionBtn}>
          <Text
            style={[
              styles.actionText,
              { color: isApplied ? colors.primary : colors.neutral400 },
            ]}
          >
            {isApplied ? "Applied" : "Mark as Applied"}
          </Text>
          {isApplied ? (
            <CheckCircle
              size={scale(20)}
              color={colors.primary}
              weight="fill"
            />
          ) : (
            <View
              style={{
                width: scale(20),
                height: scale(20),
                borderRadius: scale(10),
                borderWidth: 2,
                borderColor: colors.neutral400,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default TipCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: verticalScale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  iconBox: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: verticalScale(16),
    fontWeight: "700",
    marginBottom: verticalScale(2),
  },
  category: {
    fontSize: verticalScale(12),
    fontWeight: "600",
  },
  impactBadge: {
    backgroundColor: "rgba(22, 163, 74, 0.1)", // Green tint
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  impactText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: verticalScale(12),
  },
  description: {
    fontSize: verticalScale(14),
    lineHeight: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  tagText: {
    fontSize: verticalScale(11),
    fontWeight: "600",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  actionText: {
    fontSize: verticalScale(13),
    fontWeight: "600",
  },
});
