import { colors } from "@/constants/theme";
import { BarChart } from "react-native-gifted-charts";

import useTheme from "@/hooks/useColorScheme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const Expenses = () => {
  const filters = ["Weekly", "Monthly", "Yearly"];
  const { theme } = useTheme();
  const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">(
    "Weekly"
  );
  const [chartData, setChartData] = useState([
    {
      value: 50,
      frontColor: colors.primary,
      label: "Mon",
      spacing: scale(4),
      labelWidth: scale(35),
    },
    { value: 80, frontColor: colors.rose },
    {
      value: 90,
      frontColor: colors.primary,
      label: "Tue",
      spacing: scale(4),
      labelWidth: scale(35),
    },
    { value: 70, frontColor: colors.rose },
    {
      value: 40,
      frontColor: colors.primary,
      label: "Wed",
      spacing: scale(4),
      labelWidth: scale(35),
    },
    { value: 60, frontColor: colors.rose },
    {
      value: 99,
      frontColor: colors.primary,
      label: "Thu",
      spacing: scale(4),
      labelWidth: scale(35),
    },
    { value: 30, frontColor: colors.rose },
    {
      value: 80,
      frontColor: colors.primary,
      label: "Fri",
      spacing: scale(4),
      labelWidth: scale(35),
    },
    { value: 20, frontColor: colors.rose },
  ]);

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
          <View style={styles.noChart}></View>
        ) : (
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              isAnimated={true}
              barWidth={scale(12)}
              roundedTop
              spacing={filter === "Weekly" ? scale(16) : scale(25)}
              yAxisLabelPrefix="₹"
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={filter === "Weekly" ? scale(30) : scale(40)}
              hideRules
              yAxisTextStyle={{ color: theme.text }}
              xAxisLabelTextStyle={{
                color: theme.text,
                fontSize: verticalScale(12),
              }}
              noOfSections={3}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: verticalScale(25),
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
});
