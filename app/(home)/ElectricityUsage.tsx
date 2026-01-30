import AddElectricityLogModal from "@/components/AddElectricityLogModal";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { ElectricityLogType } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { orderBy, where } from "firebase/firestore";
import { Lightning, Plus } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const ElectricityUsage = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ElectricityLogType | null>(
    null,
  );

  const constraints = useMemo(() => {
    if (!user?.uid) return null;
    return [where("uid", "==", user.uid), orderBy("date", "desc")];
  }, [user?.uid]);

  const { data: logs, loading } = useFetch<ElectricityLogType>(
    "electricity_logs",
    constraints,
  );

  const totalKwh = logs.reduce((acc, curr) => acc + curr.kwh, 0);

  // Process data for Chart: Strickland last 7 days
  const chartData = useMemo(() => {
    const dayMap = new Map<string, number>();

    logs.forEach((log) => {
      const date =
        log.date && (log.date as any).toDate
          ? (log.date as any).toDate()
          : new Date(log.date as any);

      const key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      dayMap.set(key, (dayMap.get(key) || 0) + log.kwh);
    });

    // Generate last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split("T")[0]);
    }

    return last7Days.map((key) => {
      const date = new Date(key);
      const dayLabel = date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      });

      const val = dayMap.get(key) || 0;

      return {
        value: val,
        label: dayLabel,
        frontColor: colors.yellow,
        gradientColor: "#facc15",
        topLabelComponent: () => (
          <Text
            style={{
              color: isDark ? "white" : "gray",
              fontSize: 10,
              marginBottom: 4,
            }}
          >
            {val > 0 ? val.toFixed(1) : ""}
          </Text>
        ),
      };
    });
  }, [logs]);

  const handleFabPress = () => {
    setSelectedLog(null);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Global Background - Yellow/Dark Theme */}
      <LinearGradient
        colors={
          isDark
            ? [colors.neutral900, colors.neutral800]
            : ["#fefce8", "#fef9c3"] // Light Yellow
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.main,
          {
            paddingTop: top + 10,
            paddingBottom: bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              Electricity Usage
            </Text>
          </View>
          <View style={{ width: scale(40) }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        >
          <View style={{ marginBottom: verticalScale(24) }}>
            {/* Summary Card */}
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? [colors.neutral800, colors.neutral700]
                    : ["#ffffff", "#fefce8"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.summaryCard}
              >
                <View style={styles.summaryHeader}>
                  <View>
                    <Text style={[styles.summaryLabel, { color: theme.text }]}>
                      Total Usage
                    </Text>
                    <Text
                      style={[
                        styles.summarySubLabel,
                        { color: colors.neutral500 },
                      ]}
                    >
                      All Time
                    </Text>
                  </View>
                  <View style={styles.iconCircle}>
                    <Lightning
                      size={verticalScale(24)}
                      color={colors.yellow}
                      weight="fill"
                    />
                  </View>
                </View>

                <View style={styles.valueContainer}>
                  <Text style={[styles.summaryAmount, { color: theme.text }]}>
                    {totalKwh.toFixed(1)}
                  </Text>
                  <Text style={styles.unitText}>kWh</Text>
                </View>
              </LinearGradient>
            </View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.text,
                  marginTop: verticalScale(25),
                  marginBottom: verticalScale(15),
                },
              ]}
            >
              Usage Trends
            </Text>

            {/* Chart Container */}
            <View
              style={[
                styles.chartCard,
                { backgroundColor: isDark ? colors.neutral800 : colors.white },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="large" color={colors.yellow} />
              ) : chartData.length > 0 ? (
                <BarChart
                  data={chartData}
                  barWidth={16}
                  maxValue={
                    Math.max(...chartData.map((d) => d.value)) * 1.5 || 10
                  }
                  noOfSections={4}
                  barBorderRadius={4}
                  frontColor={colors.yellow}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  xAxisColor={colors.neutral400}
                  yAxisTextStyle={{ color: colors.neutral500, fontSize: 12 }}
                  // isAnimated
                  xAxisLabelTextStyle={{
                    color: colors.neutral400,
                    fontSize: 12,
                  }}
                  initialSpacing={10}
                  spacing={scale(20)}
                  rulesColor={
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                  }
                  rulesType="solid"
                />
              ) : (
                <View
                  style={{
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.neutral500 }}>
                    No data available to display chart
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.yellow, "#fbbf24"]} // Yellow Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Plus size={scale(28)} color={colors.neutral900} weight="bold" />
        </LinearGradient>
      </TouchableOpacity>

      <AddElectricityLogModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        initialData={selectedLog}
      />
    </View>
  );
};

export default ElectricityUsage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  headerTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardContainer: {
    shadowColor: colors.yellow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: verticalScale(24),
  },
  chartCard: {
    padding: scale(15),
    borderRadius: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    width: "100%",
    borderRadius: verticalScale(24),
    padding: scale(24),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(20),
  },
  summaryLabel: {
    fontSize: verticalScale(18),
    fontWeight: "700",
  },
  summarySubLabel: {
    fontSize: verticalScale(12),
    marginTop: verticalScale(2),
  },
  iconCircle: {
    width: verticalScale(45),
    height: verticalScale(45),
    borderRadius: verticalScale(25),
    backgroundColor: "rgba(250, 204, 21, 0.1)", // Light Yellow Tint
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: scale(6),
  },
  summaryAmount: {
    fontSize: verticalScale(42),
    fontWeight: "800",
    lineHeight: verticalScale(45),
  },
  unitText: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    color: colors.neutral500,
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: verticalScale(80),
    right: scale(30),
    shadowColor: colors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: scale(28),
  },
  fab: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
});
