import ExpenseCard from "@/components/ExpenseCard";
import TransactionListItem from "@/components/TransactionListItem";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { listenToMonthlyExpenses } from "@/services/transactionService";
import { TransactionType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { limit, orderBy, Timestamp, where } from "firebase/firestore";
import { MagnifyingGlassIcon, Plus } from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Expenses = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const { updateBudget } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      const unsub = listenToMonthlyExpenses(
        user.uid,
        user?.budgetSetDate,
        (data: { total: number; budgetUsed: number }) => {
          setCurrentMonthExpense(data.total);
          setBudgetTrackedExpense(data.budgetUsed);
        },
      );
      return () => unsub();
    }
  }, [user?.uid, user?.budgetSetDate]);

  const constraints = useMemo(() => {
    if (!user?.uid) return null;
    return [where("uid", "==", user.uid), orderBy("date", "desc"), limit(30)];
  }, [user?.uid]);

  const {
    data: transactions,
    loading: transactionLoading,
    error: transactionError,
  } = useFetch<TransactionType>("transactions", constraints);

  const [modalVisible, setModalVisible] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);
  const [budgetTrackedExpense, setBudgetTrackedExpense] = useState(0);

  const handleEditBudget = () => {
    setBudgetInput(user?.budget?.toString() || "");
    setModalVisible(true);
  };

  const handleSaveBudget = async () => {
    if (!budgetInput) {
      Alert.alert("Error", "Please enter a budget amount");
      return;
    }
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setBudgetLoading(true);
    const res = await updateBudget(amount);
    setBudgetLoading(false);

    if (res.success) {
      setModalVisible(false);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

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
      const amount = Number(curr.amount) || 0;
      if (curr.type === "income") {
        acc.income += amount;
        acc.balance += amount;
      } else {
        acc.expense += amount;
        acc.balance -= amount;
      }
      return acc;
    },
    { income: 0, expense: 0, balance: 0 },
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
      <Pressable
        style={[
          styles.header,
          {
            backgroundColor: isDark ? colors.neutral800 : colors.neutral200,
          },
        ]}
        onPress={() => {
          router.push("/ExpenseSearch");
        }}
      >
        <MagnifyingGlassIcon color={theme.text} size={scale(22)} />
        <Text
          style={{
            color: theme.text,
            fontSize: verticalScale(12),
            paddingLeft: scale(5),
            fontWeight: "400",
          }}
        >
          Search your expenses
        </Text>
      </Pressable>
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
              expense={currentMonthExpense}
              budgetExpense={budgetTrackedExpense}
              loading={transactionLoading}
              budget={user?.budget}
              onEditBudget={handleEditBudget}
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

      {/* Budget Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Set Monthly Budget
            </Text>

            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.text },
              ]}
              placeholder="Enter budget (e.g. 5000)"
              placeholderTextColor={colors.neutral500}
              keyboardType="numeric"
              value={budgetInput}
              onChangeText={setBudgetInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.neutral200 },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "black", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleSaveBudget}
                disabled={budgetLoading}
              >
                {budgetLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text style={{ color: "black", fontWeight: "600" }}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(14) },
  header: {
    marginTop: verticalScale(10),
    borderRadius: verticalScale(20),
    height: verticalScale(45),
    alignItems: "center",
    paddingLeft: scale(15),
    flexDirection: "row",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: scale(20),
    borderRadius: scale(20),
    gap: verticalScale(15),
  },
  modalTitle: {
    fontSize: verticalScale(18),
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(10),
    padding: scale(10),
    fontSize: verticalScale(16),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(10),
  },
  modalBtn: {
    flex: 1,
    padding: verticalScale(12),
    borderRadius: scale(10),
    alignItems: "center",
  },
});
