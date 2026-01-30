import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import {
  getMonthlyData,
  getWeeklyData,
  getYearlyData,
} from "@/services/transactionService";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { scale, verticalScale } from "react-native-size-matters";
import TransactionListItem from "./TransactionListItem";

const Expenses = () => {
  const { user } = useAuth();
  const filters = ["Weekly", "Monthly", "Yearly"];
  const { theme, isDark } = useTheme();
  const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">(
    "Weekly",
  );
  const [chartLoading, setchartLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>([]);
  const [transactions, settransactions] = useState<any>([]);

  useEffect(() => {
    if (filter === "Weekly") {
      getWeeklyStats();
    } else if (filter === "Monthly") {
      getMonthlyStats();
    } else {
      getYearlyStats();
    }
  }, [filter]);

  const getWeeklyStats = async () => {
    setchartLoading(true);
    let res = await getWeeklyData(user?.uid as string);
    setchartLoading(false);
    if (res.success) {
      setChartData(res.data?.stats || []);
      settransactions(res.data?.transactions || []);
    } else {
      Alert.alert("Error", res?.msg);
    }
  };

  const getMonthlyStats = async () => {
    setchartLoading(true);
    let res = await getMonthlyData(user?.uid as string);
    setchartLoading(false);
    if (res.success) {
      setChartData(res.data?.stats || []);
      settransactions(res.data?.transactions || []);
    } else {
      Alert.alert("Error", res?.msg);
    }
  };
  const getYearlyStats = async () => {
    setchartLoading(true);
    let res = await getYearlyData(user?.uid as string);
    setchartLoading(false);
    if (res.success) {
      setChartData(res.data?.stats || []);
      settransactions(res.data?.transactions || []);
    } else {
      Alert.alert("Error", res?.msg);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.filterContainer}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item as any)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  filter === item ? colors.primary : "transparent",
                borderColor: theme.text,
                borderWidth: filter === item ? 0 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === item ? colors.neutral900 : theme.text,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {chartData.length === 0 ? (
          <View style={styles.noChart} />
        ) : (
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              barWidth={scale(8)}
              roundedTop
              spacing={filter === "Weekly" ? scale(25) : scale(35)}
              yAxisLabelPrefix="₹"
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={scale(30)}
              hideRules
              yAxisTextStyle={{
                color: theme.text,
                fontSize: verticalScale(8),
              }}
              xAxisLabelTextStyle={{
                color: theme.text,
                fontSize: verticalScale(8),
              }}
              noOfSections={3}
            />
          </View>
        )}
        {chartLoading && (
          <View
            style={[
              styles.chartLoadingContainer,
              {
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.5)"
                  : "rgba(255,255,255,0.4)",
              },
            ]}
          >
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        )}
      </View>
      <View>
        <Text
          style={{
            fontSize: scale(18),
            fontWeight: "600",
            color: theme.text,
            paddingBottom: verticalScale(10),
          }}
        >
          Transactions
        </Text>
        {transactions.map((item: any, index: number) => (
          <TransactionListItem
            key={item.id || index}
            item={item}
            index={index}
            handleClick={() => {}}
          />
        ))}
      </View>
      {transactions.length === 0 && (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: scale(13), color: theme.text }}>
            No Transactions Found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(8),
  },
  contentContainer: {
    gap: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(10),
  },
  filterButton: {
    flex: 1,
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: scale(14),
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    width: "100%",
    height: verticalScale(200),
    position: "relative",
  },
  noChart: {
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(200),
  },
  chartLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});
