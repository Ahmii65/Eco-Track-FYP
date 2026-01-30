import { useAuth } from "@/contexts/authContext";
import { CarbonActivityType, TransactionType } from "@/types";
import { orderBy, Timestamp, where } from "firebase/firestore";
import {
  Bus,
  Coins,
  Fire,
  Footprints,
  HandHeart,
  Leaf,
  Lightning,
} from "phosphor-react-native";
import { useMemo } from "react";
import useFetch from "./useFetch";

export const useAchievements = () => {
  const { user } = useAuth();

  // Ensure user.uid is valid before creating constraints
  const uid = user && user.uid ? user.uid : null;

  // 1. Fetch Carbon Activities
  const { data: activities, loading: activitiesLoading } =
    useFetch<CarbonActivityType>(
      "carbon_activities",
      uid ? [where("uid", "==", uid), orderBy("date", "desc")] : null,
    );

  // 2. Fetch Transactions
  const { data: transactions, loading: transactionsLoading } =
    useFetch<TransactionType>(
      "transactions",
      uid ? [where("uid", "==", uid)] : null,
    );

  // 3. Fetch Electricity Logs
  const { data: electricityLogs, loading: electricityLoading } = useFetch<any>(
    "electricity_logs",
    uid ? [where("uid", "==", uid)] : null,
  );

  // 4. Fetch Water Logs
  const { data: waterLogs, loading: waterLoading } = useFetch<any>(
    "water_logs",
    uid ? [where("uid", "==", uid)] : null,
  );

  const loading =
    activitiesLoading ||
    transactionsLoading ||
    electricityLoading ||
    waterLoading;

  // If no user, return empty stats/loading false (or reset state)
  if (!uid) {
    return {
      achievements: [],
      goals: [],
      stats: {
        streak: 0,
        totalImpact: 0,
        transactions: 0,
        electricityLogs: 0,
        transitCount: 0,
        goodDays: 0,
        carbonSaved: 0,
        unlockedCount: 0,
        ecoScore: 0,
        currentMonthImpact: 0,
        currentMonthElectricity: 0,
        currentMonthWater: 0,
      },
      loading: false,
    };
  }

  // --- Calculations ---

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Calc Streak
    // Simple logic: consecutive days with at least one activity
    // Sort unique dates descending
    const dates = Array.from(
      new Set(
        activities.map((a) => {
          // Fix: Handle null date (pending write)
          const d = a.date ? (a.date as Timestamp).toDate() : new Date();
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      ),
    ).sort((a, b) => b - a);

    let streak = 0;
    if (dates.length > 0) {
      // Check if today or yesterday is present
      const latestInfo = dates[0];
      const latestDate = new Date(latestInfo);

      const diffDays =
        (today.getTime() - latestDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays <= 1) {
        streak = 1;
        for (let i = 0; i < dates.length - 1; i++) {
          const current = dates[i];
          const next = dates[i + 1]; // older
          const diff = (current - next) / (1000 * 3600 * 24);
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // Calc Totals
    const totalImpact = activities.reduce(
      (sum, item) => sum + (item.impact || 0),
      0,
    );
    const totalTransactions = transactions.length;
    const totalElectricityLogs = electricityLogs.length; // acts as proxy for "checking usage" or similar

    // "Transit Hero": Activities with category bus or train
    const transitCount = activities.filter((a) =>
      ["bus", "train"].includes(a.category),
    ).length;

    // "Low Carbon Week": Check last 7 days impact
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    const last7DaysImpact = activities
      .filter((a) => {
        const ad = a.date ? (a.date as Timestamp).toDate() : new Date();
        return ad >= last7Days;
      })
      .reduce((sum, a) => sum + (a.impact || 0), 0);

    const lowCarbonDays = 7; // Placeholder logic: Assume if average is low, we count "days".
    // Better logic: Count days where daily total < Threshold.
    // Let's implement: Daily threshold = 10kg. Count days in last 7 days under 10kg.
    let goodDays = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const dailyImpact = activities
        .filter((a) => {
          const ad = a.date ? (a.date as Timestamp).toDate() : new Date();
          ad.setHours(0, 0, 0, 0);
          return ad.getTime() === d.getTime();
        })
        .reduce((sum, a) => sum + (a.impact || 0), 0);

      // If they logged *something* and it was low, or (hard to distinguish no data vs good day)
      // Let's require at least one log to count as a "Good Day" to prevent inactive users getting ribbons
      const hasLogs = activities.some((a) => {
        const ad = a.date ? (a.date as Timestamp).toDate() : new Date();
        ad.setHours(0, 0, 0, 0);
        return ad.getTime() === d.getTime();
      });

      if (hasLogs && dailyImpact < 15) {
        // 15kg threshold
        goodDays++;
      }
    }

    // --- Current Month Calculations ---
    const currentMonthImpact = activities
      .filter((a) => {
        const d = a.date ? (a.date as Timestamp).toDate() : new Date();
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, a) => sum + (a.impact || 0), 0);

    const currentMonthElectricity = electricityLogs
      .filter((log: any) => {
        const d = log.date ? (log.date as Timestamp).toDate() : new Date();
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum: number, log: any) => sum + (log.kwh || 0), 0);

    const currentMonthWater = waterLogs
      .filter((log: any) => {
        const d = log.date ? (log.date as Timestamp).toDate() : new Date();
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum: number, log: any) => sum + (log.liters || 0), 0);

    return {
      streak,
      totalImpact,
      transactions: totalTransactions,
      electricityLogs: totalElectricityLogs,
      transitCount,
      goodDays,
      carbonSaved: 0,
      currentMonthImpact,
      currentMonthElectricity,
      currentMonthWater,
    };
  }, [activities, transactions, electricityLogs, waterLogs]);

  // --- Daily Goals Logic - Used in Eco Score Calculation ---
  const goalsLogic = useMemo(() => {
    // Helper to identify goal activities for score calc without time constraint (total completions)
    const isGoalCategory = (cat: string) =>
      ["plant_tree", "volunteer"].includes(cat);
    return { isGoalCategory };
  }, []);

  // --- Achievements Defs ---
  const achievements = [
    {
      id: "streak",
      title: "Green Streak",
      description: "Log activities for consecutive days",
      progress: stats.streak,
      total: 7, // Bronze tier target
      icon: Fire,
      isUnlocked: stats.streak >= 7,
      tier: "gold",
    },
    {
      id: "transit",
      title: "Transit Hero",
      description: "Take public transport trips",
      progress: stats.transitCount,
      total: 10,
      icon: Bus,
      isUnlocked: stats.transitCount >= 10,
      tier: "silver",
    },
    {
      id: "spender",
      title: "Eco Spender",
      description: "Track your expenses",
      progress: stats.transactions,
      total: 20,
      icon: Coins,
      isUnlocked: stats.transactions >= 20,
      tier: "bronze",
    },
    {
      id: "impact_low",
      title: "Low Carbon Week",
      description: "Days under 15kg CO2 (Last 7 Days)",
      progress: stats.goodDays,
      total: 7,
      icon: Leaf,
      isUnlocked: stats.goodDays >= 5, // Unlock at 5 good days
      tier: "gold",
    },
    {
      id: "logger",
      title: "Carbon Tracker",
      description: "Log total activities",
      progress: activities.length,
      total: 50,
      icon: Footprints,
      isUnlocked: activities.length >= 50,
      tier: "silver",
    },
    {
      id: "energy",
      title: "Energy Watcher",
      description: "Log electricity usage",
      progress: stats.electricityLogs,
      total: 5,
      icon: Lightning,
      isUnlocked: stats.electricityLogs >= 5,
      tier: "bronze",
    },
  ];

  // Calculate total unlocked for badges count
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  // --- Eco Score Calculation ---
  // Base: Streak * 5 + Badges * 10
  // Activity Bonus: +1 for normal, +2 for Daily Goals (plant_tree, volunteer)
  const activityScore = activities.reduce((sum, item) => {
    if (["plant_tree", "volunteer"].includes(item.category)) {
      return sum + 2;
    }
    return sum + 1;
  }, 0);

  const ecoScore = Math.min(
    100,
    stats.streak * 5 + unlockedCount * 10 + activityScore,
  );

  // --- Daily Goals Logic for UI ---
  const goals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const isCompletedToday = (category: string) => {
      return activities.some((a) => {
        const d = a.date ? (a.date as Timestamp).toDate() : new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayTime && a.category === category;
      });
    };

    return [
      {
        id: "daily_tree",
        title: "Plant a Tree",
        category: "plant_tree",
        isCompleted: isCompletedToday("plant_tree"),
        icon: Leaf,
        color: "#16a34a",
      },
      {
        id: "daily_volunteer",
        title: "Volunteer Work",
        category: "volunteer",
        isCompleted: isCompletedToday("volunteer"),
        icon: HandHeart,
        color: "#9333ea",
      },
    ];
  }, [activities]);

  return {
    achievements,
    goals,
    stats: {
      ...stats,
      unlockedCount,
      ecoScore,
    },
    loading,
  };
};
