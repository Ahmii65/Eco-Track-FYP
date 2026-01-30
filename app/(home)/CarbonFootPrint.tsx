import BackButton from "@/components/BackButton";
import CarbonActivityItem from "@/components/CarbonActivityItem";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { CarbonActivityType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import { Leaf, Plus } from "phosphor-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const CarbonFootPrint = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const constraints = useMemo(() => {
    if (!user?.uid) return null;
    return [where("uid", "==", user.uid), orderBy("date", "desc"), limit(50)];
  }, [user?.uid]);

  const {
    data: activities,
    loading,
    error,
  } = useFetch<CarbonActivityType>("carbon_activities", constraints);

  const totalEmissions = activities.reduce((acc, curr) => acc + curr.impact, 0);

  const handleCallback = (item: CarbonActivityType) => {
    router.push({
      pathname: "/AddActivity",
      params: {
        id: item.id,
        title: item.title,
        category: item.category,
        impact: item.impact.toString(),
        date: (item.date as any).toDate().toISOString(),
        uid: item.uid,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Global Background */}
      <LinearGradient
        colors={
          isDark
            ? [colors.neutral900, colors.neutral800]
            : [colors.neutral50, "#f0fdf4"]
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
              Carbon Footprint
            </Text>
          </View>
          {/* Spacer to balance BackButton */}
          <View style={{ width: scale(40) }} />
        </View>

        <FlashList
          data={activities}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(100) }}
          renderItem={({ item, index }) => (
            <CarbonActivityItem
              item={item}
              index={index}
              handleClick={handleCallback}
            />
          )}
          ListHeaderComponent={
            <View style={{ marginBottom: verticalScale(24) }}>
              {/* Summary Card */}
              <View style={styles.cardContainer}>
                <LinearGradient
                  colors={
                    isDark
                      ? [colors.neutral800, colors.neutral700]
                      : ["#ffffff", "#f0fdf4"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.summaryCard}
                >
                  <View style={styles.summaryHeader}>
                    <View>
                      <Text
                        style={[styles.summaryLabel, { color: theme.text }]}
                      >
                        Total Emissions
                      </Text>
                      <Text
                        style={[
                          styles.summarySubLabel,
                          { color: colors.neutral500 },
                        ]}
                      >
                        My Impact
                      </Text>
                    </View>
                    <View style={styles.iconCircle}>
                      <Leaf
                        size={verticalScale(24)}
                        color={colors.green}
                        weight="fill"
                      />
                    </View>
                  </View>

                  <View style={styles.valueContainer}>
                    <Text style={[styles.summaryAmount, { color: theme.text }]}>
                      {totalEmissions.toFixed(1)}
                    </Text>
                    <Text style={styles.unitText}>kg CO₂e</Text>
                  </View>

                  <View style={styles.divider} />

                  <Text
                    style={{
                      color: colors.neutral400,
                      fontSize: verticalScale(12),
                    }}
                  >
                    Based on your recent activities
                  </Text>
                </LinearGradient>
              </View>

              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginTop: verticalScale(25) },
                ]}
              >
                Recent Activities
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <Text style={{ color: colors.neutral500 }}>
                  No activities recorded yet.
                </Text>
              )}
            </View>
          }
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={() => router.push("/AddActivity")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, "#0f766e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Plus size={scale(28)} color={colors.white} weight="bold" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default CarbonFootPrint;

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: verticalScale(24),
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
    backgroundColor: "rgba(22, 163, 74, 0.1)",
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
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: verticalScale(15),
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
    shadowColor: colors.primary,
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
