import BackButton from "@/components/BackButton";
import TipCard from "@/components/TipCard";
import { colors } from "@/constants/theme";
import { tipsData } from "@/constants/tipsData";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { fetchUserAppliedTips, toggleTipStatus } from "@/services/tipsService";
import { Lightbulb } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const TipsAndTricks = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  const [appliedTips, setAppliedTips] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (user?.uid) {
      loadTips();
    }
  }, [user?.uid]);

  const loadTips = async () => {
    if (!user?.uid) return;
    const tips = await fetchUserAppliedTips(user.uid);
    setAppliedTips(new Set(tips));
  };

  const toggleApply = async (id: string) => {
    if (!user?.uid) return;

    // Optimistic Update
    const isCurrentlyApplied = appliedTips.has(id);
    const newStatus = !isCurrentlyApplied;

    setAppliedTips((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyApplied) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    // Backend Update
    await toggleTipStatus(user.uid, id, newStatus);
  };

  const filteredTips =
    selectedCategory === "All"
      ? tipsData
      : tipsData.filter((t) => t.category === selectedCategory);

  const recommendedTip = tipsData[0]; // Simple recommendation logic for now

  // Categories for chips
  const categories = ["All", "Energy", "Transport", "Food", "Spending"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: top + 10 }]}>
        <BackButton />
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Tips & Tricks
        </Text>
        <View style={{ width: scale(40) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro / Points Summary (Gamification) */}
        <View style={styles.pointsCard}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(8),
            }}
          >
            <Lightbulb size={scale(24)} color={colors.white} weight="fill" />
            <Text style={styles.pointsTitle}>Your Eco Knowledge</Text>
          </View>
          <Text style={styles.pointsValue}>
            {Array.from(appliedTips).reduce((acc, id) => {
              const tip = tipsData.find((t) => t.id === id);
              return acc + (tip?.points || 0);
            }, 0)}{" "}
            pts
          </Text>
          <Text style={styles.pointsSubtitle}>
            Earn points by applying tips!
          </Text>
        </View>

        {/* Recommended Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recommended for You
        </Text>
        <TipCard
          item={recommendedTip}
          index={0}
          isApplied={appliedTips.has(recommendedTip.id)}
          onApply={toggleApply}
        />

        {/* Filter Chips */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginTop: verticalScale(10) },
          ]}
        >
          Browse Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                        ? colors.neutral800
                        : colors.neutral200,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected
                        ? colors.white
                        : isDark
                          ? colors.neutral400
                          : colors.neutral600,
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List of Tips */}
        <View style={styles.listContainer}>
          {filteredTips.map((item, index) => (
            <TipCard
              key={item.id}
              item={item}
              index={index}
              isApplied={appliedTips.has(item.id)}
              onApply={toggleApply}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TipsAndTricks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
  },
  pointsCard: {
    backgroundColor: colors.primary,
    borderRadius: verticalScale(20),
    padding: scale(20),
    marginBottom: verticalScale(24),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: verticalScale(14),
    fontWeight: "600",
  },
  pointsValue: {
    color: colors.white,
    fontSize: verticalScale(32),
    fontWeight: "800",
    marginTop: verticalScale(8),
  },
  pointsSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: verticalScale(12),
    marginTop: verticalScale(4),
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    marginBottom: verticalScale(12),
  },
  chipsContainer: {
    gap: scale(10),
    marginBottom: verticalScale(20),
  },
  chip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
  },
  chipText: {
    fontSize: verticalScale(13),
    fontWeight: "600",
  },
  listContainer: {
    gap: verticalScale(10),
  },
});
