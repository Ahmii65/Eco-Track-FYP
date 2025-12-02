import BackButton from "@/components/BackButton";
import TransactionListItem from "@/components/TransactionListItem";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { TransactionType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const ExpenseSearch = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState<string>("");
  const {
    data: SearchTransactions,
    loading: transactionLoading,
    error: transactionError,
  } = useFetch<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
  ]);

  const filteredTransaction = SearchTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase().includes(search?.toLowerCase()) ||
        item.description?.toLowerCase().includes(search?.toLowerCase()) ||
        item.type?.toLowerCase().includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return false;
  });
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
      <View style={styles.header}>
        <BackButton />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            marginRight: scale(35),
          }}
        >
          <Text style={[styles.headerText, { color: theme.text }]}>Search</Text>
        </View>
      </View>
      <TextInput
        placeholder="Search Expenses"
        placeholderTextColor={theme.text}
        value={search}
        onChangeText={(value) => {
          setSearch(value);
        }}
        style={{
          padding: verticalScale(16),
          borderWidth: 1,
          borderColor: theme.text,
          borderRadius: verticalScale(12),
          color: theme.text,
          backgroundColor: isDark ? colors.neutral800 : colors.neutral200,
          marginBottom: verticalScale(15),
        }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: verticalScale(20),
        }}
        style={{ flex: 1 }}
      >
        {filteredTransaction.map((item: any, index: number) => (
          <TransactionListItem
            key={item.id || index}
            item={item} 
            index={index}
            handleClick={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ExpenseSearch;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
});
