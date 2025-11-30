import ExpenseCard from "@/components/ExpenseCard";
import TransactionListItem from "@/components/TransactionListItem";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { TransactionType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { limit, orderBy, Timestamp, where } from "firebase/firestore";
import { MagnifyingGlassIcon, Plus } from "phosphor-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Expenses = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const {
    data: transactions,
    loading: transactionLoading,
    error: transactionError,
  } = useFetch<TransactionType>(
    user?.uid ? "transactions" : "",
    user?.uid
      ? [where("uid", "==", user.uid), orderBy("date", "desc"), limit(30)]
      : [],
    [user?.uid]
  );

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/AddTransaction",
      params: {
        id: item?.id,
        amount: item?.amount?.toString(),
        type: item.type,
        category: item.category,
        description: item.description,
        date: (item?.date as Timestamp)?.toDate()?.toISOString(),
        walletId: item?.walletId,
        uid: item?.uid,
        image: item?.image,
      },
    });
  };

  const { income, expense, balance } = transactions.reduce(
    (acc, curr) => {
      if (curr.type === "income") {
        acc.income += curr.amount;
        acc.balance += curr.amount;
      } else {
        acc.expense += curr.amount;
        acc.balance -= curr.amount;
      }
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

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
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? colors.neutral700 : colors.neutral200,
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        <MagnifyingGlassIcon color={theme.text} size={scale(22)} />
      </View>
      <FlashList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        data={transactions}
        renderItem={({ item, index }) => (
          <TransactionListItem
            item={item}
            index={index}
            handleClick={() => handleClick(item)}
          />
        )}
        ListHeaderComponent={
          <View>
            <ExpenseCard
              amount={balance}
              income={income}
              expense={expense}
              loading={transactionLoading}
            />
            <Text
              style={{
                fontSize: verticalScale(16),
                fontWeight: "500",
                color: theme.text,
                paddingVertical: verticalScale(15),
              }}
            >
              Recent Transactions
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              paddingVertical: verticalScale(40),
              alignItems: "center",
            }}
          >
            {transactionLoading ? (
              <ActivityIndicator size={"large"} color={colors.primary} />
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: colors.neutral500,
                }}
              >
                No Transaction yet
              </Text>
            )}
          </View>
        }
      />
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: bottom + verticalScale(20),
          },
        ]}
        onPress={() => {
          router.push("/AddTransaction");
        }}
        activeOpacity={0.8}
      >
        <Plus size={scale(28)} color={colors.neutral900} weight="bold" />
      </TouchableOpacity>
    </View>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
  header: {
    alignSelf: "flex-end",
    padding: moderateScale(11.5),
    borderWidth: 1,
    borderRadius: verticalScale(15),
  },
  fab: {
    position: "absolute",
    right: scale(20),
    width: scale(50),
    height: scale(50),
    borderRadius: scale(28),
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
