import BackButton from "@/components/BackButton";
import { fireStore } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { useAchievements } from "@/hooks/useAchievements";
import useTheme from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Check, Fire, Lock, Trophy } from "phosphor-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

// --- Constants & Types ---
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - scale(48)) / 2;

const StatsSection = ({
  theme,
  isDark,
  stats,
}: {
  theme: any;
  isDark: boolean;
  stats: any;
}) => (
  <View style={styles.statsWrapper}>
    <View
      style={[
        styles.scoreBoard,
        {
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          elevation: isDark ? 0 : 2,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: scale(10),
        },
      ]}
    >
      {/* Score Circle */}
      <View style={styles.scoreContainer}>
        <LinearGradient
          colors={["#00E096", "#00B2FF"]}
          style={styles.scoreCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.scoreText}>{stats.ecoScore}</Text>
        </LinearGradient>
        <Text style={styles.scoreLabel}>
          {stats.ecoScore > 80
            ? "Excellent"
            : stats.ecoScore > 50
              ? "Good"
              : "Eco-Starter"}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Fire size={scale(20)} color="#FF9F43" weight="fill" />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.streak} Days
          </Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Trophy size={scale(20)} color="#FFD700" weight="fill" />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.unlockedCount}
          </Text>
          <Text style={styles.statLabel}>Awards</Text>
        </View>
      </View>
    </View>
  </View>
);

const DailyGoalCard = ({
  item,
  index,
  theme,
  isDark,
  onComplete,
}: {
  item: any;
  index: number;
  theme: any;
  isDark: boolean;
  onComplete: (item: any) => void;
}) => {
  const IconComponent = item.icon;
  const isCompleted = item.isCompleted;

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <View
        style={[
          styles.goalCard,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <View style={styles.goalContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isCompleted
                  ? isDark
                    ? "rgba(0, 224, 150, 0.1)"
                    : "#E0FDF4"
                  : isDark
                    ? "#2A2A2A"
                    : "#F5F5F5",
              },
            ]}
          >
            <IconComponent
              size={scale(24)}
              color={isCompleted ? "#00E096" : item.color}
              weight={isCompleted ? "fill" : "regular"}
            />
          </View>
          <View style={{ marginLeft: scale(12), flex: 1 }}>
            <Text style={[styles.goalTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={styles.goalSubtitle}>
              {isCompleted ? "Completed today!" : "Daily Goal"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: isCompleted
                ? isDark
                  ? "#2A2A2A"
                  : "#F0F0F0"
                : item.color,
            },
          ]}
          onPress={() => onComplete(item)}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <Check size={scale(16)} color={theme.text} weight="bold" />
          ) : (
            <Text style={styles.actionButtonText}>Complete</Text>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const AchievementCard = ({
  item,
  index,
  theme,
  isDark,
}: {
  item: any;
  index: number;
  theme: any;
  isDark: boolean;
}) => {
  const IconComponent = item.icon;
  // Cap progress at 100%
  const progressPercent = Math.min(100, (item.progress / item.total) * 100);

  // Dynamic colors based on unlock state & theme
  const iconColor = item.isUnlocked
    ? "#00E096"
    : isDark
      ? "#636E72"
      : "#9E9E9E";
  const cardOpacity = item.isUnlocked ? 1 : isDark ? 0.8 : 0.6;

  // Light mode specific adjustments
  const cardBg = isDark ? (item.isUnlocked ? "#1E1E1E" : "#161616") : "#FFFFFF";

  const borderColor = isDark
    ? item.isUnlocked
      ? "rgba(0, 224, 150, 0.3)"
      : "rgba(255, 255, 255, 0.05)"
    : "rgba(0,0,0,0.05)";

  // Glow only in dark mode
  const glowColor =
    isDark && item.isUnlocked ? "rgba(0, 224, 150, 0.15)" : "transparent";

  // Icon container bg
  const iconContainerBg = isDark
    ? item.isUnlocked
      ? "rgba(0, 224, 150, 0.1)"
      : "#2A2A2A"
    : item.isUnlocked
      ? "#E0FDF4"
      : "#F5F5F5";

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            borderColor: borderColor,
            backgroundColor: cardBg,
            elevation: isDark ? 0 : 2,
            shadowColor: "#000",
            shadowOpacity: isDark ? 0 : 0.05,
            shadowRadius: scale(8),
            shadowOffset: { width: 0, height: verticalScale(2) },
          },
        ]}
      >
        {/* Background Glow for unlocked cards (Dark Mode Only) */}
        {item.isUnlocked && isDark && (
          <View
            style={[styles.glowBackground, { backgroundColor: glowColor }]}
          />
        )}

        {/* Header: Icon & Tier */}
        <View style={styles.cardHeader}>
          <View
            style={[styles.iconContainer, { backgroundColor: iconContainerBg }]}
          >
            <IconComponent
              size={scale(24)}
              color={iconColor}
              weight={item.isUnlocked ? "fill" : "regular"}
            />
          </View>
          {!item.isUnlocked && (
            <Lock
              size={scale(16)}
              color={isDark ? "#636E72" : "#B0B0B0"}
              style={styles.lockIcon}
            />
          )}
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.text },
              !item.isUnlocked && styles.dimText,
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0" },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: item.isUnlocked
                    ? "#00E096"
                    : isDark
                      ? "#636E72"
                      : "#B0B0B0",
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress} / {item.total}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// --- Main Screen ---
const Achievements = () => {
  const { theme, isDark } = useTheme();
  const { achievements, goals, stats } = useAchievements();
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  const [logging, setLogging] = useState(false);

  const handleCompleteGoal = async (goal: any) => {
    if (!user) return;
    if (logging) return;

    setLogging(true);
    try {
      await addDoc(collection(fireStore, "carbon_activities"), {
        uid: user.uid,
        category: goal.category, // 'plant_tree' or 'volunteer'
        title: goal.title,
        impact: goal.category === "plant_tree" ? -10 : 0, // Negative impact for positive action
        date: serverTimestamp(),
      });
      // UI will update automatically due to real-time listener in useAchievements -> useFetch
      Alert.alert("Awesome!", `You completed: ${goal.title}`);
    } catch (error) {
      console.error("Error logging goal:", error);
      Alert.alert("Error", "Failed to log activity.");
    } finally {
      setLogging(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Gradient only for Dark Mode to maintain depth, or subtle for light */}
      {isDark && (
        <LinearGradient
          colors={["#121212", "#0A0A0A"]}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Header with Back Button */}
      <View
        style={[
          styles.header,
          {
            paddingTop: top + 10,
          },
        ]}
      >
        <BackButton />
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Achievements
          </Text>
        </View>
        <View style={{ width: scale(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatsSection theme={theme} isDark={isDark} stats={stats} />

        {/* Daily Goals Section */}
        {goals && goals.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Daily Goals
              </Text>
            </View>
            <View style={styles.goalsContainer}>
              {goals.map((item: any, index: number) => (
                <DailyGoalCard
                  key={item.id}
                  item={item}
                  index={index}
                  theme={theme}
                  isDark={isDark}
                  onComplete={handleCompleteGoal}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Badges
          </Text>
        </View>

        <View style={styles.grid}>
          {achievements.map((item, index) => (
            <AchievementCard
              key={item.id}
              item={item}
              index={index}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Achievements;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: verticalScale(14),
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
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
  statsWrapper: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  scoreBoard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(10),
    borderRadius: scale(20),
    padding: scale(20),
    borderWidth: 1,
  },
  scoreContainer: {
    alignItems: "center",
    marginRight: scale(24),
  },
  scoreCircle: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E096",
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 8,
  },
  scoreText: {
    fontSize: verticalScale(24),
    fontWeight: "800",
    color: "#FFFFFF",
  },
  scoreLabel: {
    color: "#00E096",
    fontSize: verticalScale(12),
    fontWeight: "600",
    marginTop: verticalScale(8),
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: verticalScale(16),
    fontWeight: "700",
    marginTop: verticalScale(4),
  },
  statLabel: {
    color: "#808080",
    fontSize: verticalScale(12),
  },
  // Grid
  sectionHeader: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: verticalScale(20),
    fontWeight: "700",
  },
  goalsContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scale(16),
    justifyContent: "space-between",
  },
  // Goal Card
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    borderRadius: scale(16),
    borderWidth: 1,
    marginBottom: verticalScale(8),
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  goalTitle: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  goalSubtitle: {
    color: "#808080",
    fontSize: verticalScale(12),
  },
  actionButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    minWidth: scale(80),
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: verticalScale(12),
    fontWeight: "600",
  },
  // Card
  card: {
    width: CARD_WIDTH,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  glowBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    opacity: 0.5,
  },
  cardContent: {
    marginBottom: verticalScale(16),
    minHeight: verticalScale(60),
  },
  cardTitle: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  dimText: {
    opacity: 0.7,
  },
  cardDescription: {
    color: "#808080",
    fontSize: verticalScale(12),
    lineHeight: verticalScale(18),
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBarBg: {
    flex: 1,
    height: verticalScale(4),
    borderRadius: scale(2),
    marginRight: scale(8),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: scale(2),
  },
  progressText: {
    color: "#808080",
    fontSize: verticalScale(10),
    fontWeight: "600",
  },
});
