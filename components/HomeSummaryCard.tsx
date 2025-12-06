import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { Drop, Footprints, Lightning, Warning } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const HomeSummaryCard = () => {
  const { theme, isDark } = useTheme();
  const [warning, setwarning] = useState<boolean>(false);

  // Mock Data
  const carbonFootprint = 201; // kgCO2
  const maxFootprint = 200;
  const waterUsage = 120; // Liters
  const electricityUsage = 45; // kWh
  const progress = Math.min(carbonFootprint / maxFootprint, 1) * 100;
  const isLimitExceeded = carbonFootprint > maxFootprint;

  useEffect(() => {
    if (isLimitExceeded) {
      setwarning(true);
    }
  }, [isLimitExceeded]);

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
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Footprints
                size={verticalScale(18)}
                color={isDark ? colors.primary : colors.green}
                weight="fill"
              />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              This Month
            </Text>
          </View>
          <Text style={[styles.mainValue, { color: theme.text }]}>
            {carbonFootprint} <Text style={styles.unit}>kgCO2</Text>
          </Text>
        </View>

        {/* Tri-color Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={
                isLimitExceeded
                  ? ["#ef4444", "#b91c1c"]
                  : progress > 60
                  ? ["#f59e0b", "#f97316"]
                  : ["#22c55e", "#16a34a"]
              } // Green -> Yellow -> Red
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Low</Text>
            <Text style={styles.progressLabel}>High</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          {/* Water Usage */}
          <View style={styles.statItem}>
            <View
              style={[styles.miniIconBox, { backgroundColor: "#0ea5e920" }]}
            >
              <Drop size={verticalScale(14)} color="#0ea5e9" weight="fill" />
            </View>
            <View>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {waterUsage}L
              </Text>
              <Text style={styles.statLabel}>Water</Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDark ? colors.neutral600 : colors.neutral300,
              },
            ]}
          />

          {/* Electricity Usage */}
          <View style={styles.statItem}>
            <View
              style={[styles.miniIconBox, { backgroundColor: "#eab30820" }]}
            >
              <Lightning
                size={verticalScale(14)}
                color="#eab308"
                weight="fill"
              />
            </View>
            <View>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {electricityUsage} kWh
              </Text>
              <Text style={styles.statLabel}>Electricity</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {warning && (
        <View
          style={[
            styles.warning,
            {
              backgroundColor: isDark ? colors.neutral800 : colors.neutral300,
            },
          ]}
        >
          <Warning weight="fill" color={"yellow"} />
          <Text
            style={{
              color: theme.text,
              fontSize: verticalScale(12),
              fontWeight: "500",
            }}
          >
            Above 200 kgCO₂ this month{"  "}
            <Text
              onPress={() => setwarning(false)}
              style={{
                color: isDark ? colors.primary : colors.neutral500,
              }}
            >
              Tap to hide
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default HomeSummaryCard;

const styles = StyleSheet.create({
  card: {
    height: verticalScale(190), // Increased slightly for spacing
    borderRadius: verticalScale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    justifyContent: "space-between",
  },
  header: {
    marginBottom: verticalScale(10),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(5),
    gap: scale(8),
  },
  iconBox: {
    width: verticalScale(30),
    height: verticalScale(30),
    borderRadius: verticalScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: "600",
    opacity: 0.8,
  },
  mainValue: {
    fontSize: verticalScale(24),
    fontWeight: "700",
  },
  unit: {
    fontSize: verticalScale(14),
    fontWeight: "500",
    opacity: 0.6,
  },
  progressContainer: {
    marginBottom: verticalScale(15),
  },
  progressBarBg: {
    height: verticalScale(8),
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: verticalScale(4),
    overflow: "hidden",
    marginBottom: verticalScale(4),
  },
  progressBarFill: {
    height: "100%",
    borderRadius: verticalScale(4),
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: verticalScale(10),
    color: "#888",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(5),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    flex: 1,
  },
  miniIconBox: {
    width: verticalScale(26),
    height: verticalScale(26),
    borderRadius: verticalScale(13),
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: verticalScale(14),
    fontWeight: "600",
  },
  statLabel: {
    fontSize: verticalScale(11),
    color: "#888",
  },
  divider: {
    width: 1,
    height: "100%",
    marginHorizontal: scale(10),
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
});
