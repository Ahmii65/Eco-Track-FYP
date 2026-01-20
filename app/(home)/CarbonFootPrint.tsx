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

  const constraints = useMemo(
    () => [where("uid", "==", user?.uid), orderBy("date", "desc"), limit(50)],
    [user?.uid],
  );

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
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            marginRight: scale(35),
          }}
        >
          <Text style={[styles.headerText, { color: theme.text }]}>
            Carbon Footprint
          </Text>
        </View>
      </View>

      <FlashList
        data={activities}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        renderItem={({ item, index }) => (
          <CarbonActivityItem
            item={item}
            index={index}
            handleClick={handleCallback}
          />
        )}
        ListHeaderComponent={
          <View style={{ marginBottom: verticalScale(20) }}>
            <LinearGradient
              colors={
                isDark
                  ? [colors.neutral800, colors.neutral700]
                  : ["#e5e5e5", "#d4d4d4"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryCard}
            >
              <View style={styles.summaryHeader}>
                <Text style={[styles.summaryLabel, { color: theme.text }]}>
                  Total Emissions
                </Text>
                <Leaf
                  size={verticalScale(24)}
                  color={colors.green}
                  weight="fill"
                />
              </View>
              <Text style={[styles.summaryAmount, { color: theme.text }]}>
                {totalEmissions.toFixed(2)}{" "}
                <Text style={{ fontSize: 16 }}>kg CO2e</Text>
              </Text>
              <Text style={{ color: colors.neutral500, marginTop: 5 }}>
                Latest contribution based on your activities
              </Text>
            </LinearGradient>

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.text, marginTop: verticalScale(20) },
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

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: bottom + verticalScale(20),
          },
        ]}
        onPress={() => router.push("/AddActivity")}
        activeOpacity={0.8}
      >
        <Plus size={scale(28)} color={colors.neutral900} weight="bold" />
      </TouchableOpacity>
    </View>
  );
};

export default CarbonFootPrint;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  summaryCard: {
    width: "100%",
    borderRadius: verticalScale(20),
    padding: scale(20),
    justifyContent: "center",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  summaryLabel: {
    fontSize: verticalScale(16),
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: verticalScale(32),
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: "600",
    marginBottom: verticalScale(10),
  },
  emptyContainer: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: scale(20),
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
