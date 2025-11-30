import BackButton from "@/components/BackButton";
import ImageIcon from "@/components/ImageIcon";
import TouchableButton from "@/components/TouchableButton";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { uploadToCloudinary } from "@/services/imageServices";
import {
  createOrUpdateTransaction,
  delTransaction,
} from "@/services/transactionService";
import { TransactionType, WalletType } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

type ParamType = {
  id: string;
  amount: string;
  description?: string;
  category: string;
  date: string;
  walletId: string;
  type: string;
  image?: any | null;
  uid: string;
};

const AddTransaction = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const [transaction, setTransaction] = useState<TransactionType>({
    image: null,
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [Deleteloading, setDeleteLoading] = useState<boolean>(false);
  const [showDatePicker, setshowDatePicker] = useState<boolean>(false);
  const initialTransactionRef = useRef<string>("");

  const {
    data: wallets,
    loading: walletLoading,
    error: walletErrors,
  } = useFetch<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: ParamType = useLocalSearchParams();
  const onSubmit = async () => {
    let { amount, description, category, date, walletId, type, image } =
      transaction;
    if (!amount || !walletId || !date || !type) {
      Alert.alert("Transaction", "Please Fill all the fields");
      return;
    }

    if (type === "expense" && !category) {
      Alert.alert("Transaction", "Please select an expense category");
      return;
    }

    let transactionData: TransactionType = {
      amount,
      description,
      category,
      date,
      walletId,
      type,
      image: image || null, 
      uid: user?.uid,
    };
    if (oldTransaction?.id) {
      transactionData.id = oldTransaction?.id;
    }
    // console.log(oldTransaction.id);

    setLoading(true);

    // upload image
    if (image) {
      const imageRes = await uploadToCloudinary(image, "transactions");
      if (imageRes.success) {
        transactionData.image = imageRes.data;
      } else {
        transactionData.image = null;
      }
    }

    const res = await createOrUpdateTransaction(
      transactionData,
      walletId,
      oldTransaction?.id
    );
    setLoading(false);
    // console.log(res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        amount: Number(oldTransaction.amount),
        description: oldTransaction.description,
        category: oldTransaction.category,
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        type: oldTransaction.type,
        image: oldTransaction.image,
        uid: oldTransaction.uid,
      });
    }
  }, []);

  const handleDeleteTransaction = () => {
    Alert.alert("Confirm", "Are you sure you want to delete Wallet", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            await delTransaction(oldTransaction?.id);
            router.back();
          } catch (err) {
            Alert.alert("Transaction", "Failed to deslete transaction");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setshowDatePicker(false);
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
      <View style={[styles.headerContainer, { paddingHorizontal: scale(20) }]}>
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
              {oldTransaction?.id ? "Update Transaction" : "New Transaction"}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          gap: verticalScale(10),
          paddingBottom: verticalScale(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.date, { color: theme.text }]}>Amount</Text>
        <TextInput
          value={transaction.amount?.toString()}
          keyboardType="numeric"
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, "");
            setTransaction({ ...transaction, amount: Number(numericValue) });
          }}
          style={{
            height: verticalScale(54),
            paddingLeft: verticalScale(15),
            borderWidth: 1,
            borderColor: theme.text,
            borderRadius: verticalScale(15),
            color: theme.text,
          }}
        />
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Text style={[styles.date, { color: theme.text }]}>Description</Text>
          <Text
            style={[
              styles.date,
              { color: colors.neutral500, fontSize: verticalScale(14) },
            ]}
          >
            (Optional)
          </Text>
        </View>
        <TextInput
          multiline
          value={transaction.description}
          onChangeText={(value) => {
            setTransaction({ ...transaction, description: value });
          }}
          style={{
            flexDirection: "row",
            height: verticalScale(100),
            padding: verticalScale(15),
            borderWidth: 1,
            borderColor: theme.text,
            borderRadius: verticalScale(15),
            color: theme.text,
            textAlignVertical: "top",
          }}
        />
        <Text style={[styles.date, { color: theme.text }]}>Type</Text>
        <Dropdown
          style={[styles.dropdownCont, { borderColor: theme.text }]}
          selectedTextStyle={[styles.selectedTextStyle, { color: theme.text }]}
          iconStyle={styles.iconStyle}
          data={transactionTypes}
          activeColor={isDark ? colors.neutral700 : colors.neutral200}
          maxHeight={230}
          labelField="label"
          valueField="value"
          value={transaction.type}
          onChange={(item) => {
            setTransaction({ ...transaction, type: item.value });
          }}
          itemTextStyle={{ color: theme.text }}
          itemContainerStyle={[
            styles.itemContainerStyle,
            { backgroundColor: theme.background },
          ]}
          containerStyle={[
            styles.containerStyle,
            {
              backgroundColor: theme.background,
            },
          ]}
        />
        <Text style={[styles.date, { color: theme.text }]}>Wallet</Text>
        <Dropdown
          style={[styles.dropdownCont, { borderColor: theme.text }]}
          placeholderStyle={{ color: theme.text }}
          selectedTextStyle={[styles.selectedTextStyle, { color: theme.text }]}
          iconStyle={styles.iconStyle}
          data={
            wallets.length > 0
              ? wallets.map((wallet) => ({
                  label: `${wallet?.name} (Rs ${wallet?.amount})`,
                  value: wallet?.id,
                }))
              : [
                  {
                    label: "No wallets found",
                    value: null,
                  },
                ]
          }
          activeColor={isDark ? colors.neutral700 : colors.neutral200}
          maxHeight={230}
          labelField="label"
          valueField="value"
          value={transaction.walletId}
          placeholder="Select Wallet"
          onChange={(item) => {
            setTransaction({ ...transaction, walletId: item.value || "" });
          }}
          itemTextStyle={{ color: theme.text }}
          itemContainerStyle={[
            styles.itemContainerStyle,
            { backgroundColor: theme.background },
          ]}
          containerStyle={[
            styles.containerStyle,
            {
              backgroundColor: theme.background,
            },
          ]}
        />
        {transaction.type == "expense" && (
          <View style={{ gap: scale(10) }}>
            <Text style={[styles.date, { color: theme.text }]}>
              Expense Category
            </Text>
            <Dropdown
              style={[styles.dropdownCont, { borderColor: theme.text }]}
              placeholderStyle={{ color: theme.text }}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { color: theme.text },
              ]}
              iconStyle={styles.iconStyle}
              data={Object.values(expenseCategories)}
              activeColor={isDark ? colors.neutral700 : colors.neutral200}
              maxHeight={230}
              labelField="label"
              valueField="value"
              value={transaction.category}
              placeholder="Select category"
              onChange={(item) => {
                setTransaction({
                  ...transaction,
                  category: item.value || "",
                });
              }}
              itemTextStyle={{ color: theme.text }}
              itemContainerStyle={[
                styles.itemContainerStyle,
                { backgroundColor: theme.background },
              ]}
              containerStyle={[
                styles.containerStyle,
                {
                  backgroundColor: theme.background,
                },
              ]}
            />
          </View>
        )}
        <Text style={[styles.date, { color: theme.text }]}>Date</Text>

        <Pressable
          style={{
            height: verticalScale(54),
            borderWidth: 1,
            borderColor: theme.text,
            borderRadius: verticalScale(15),
            justifyContent: "center",
          }}
          onPress={() => setshowDatePicker(true)}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: verticalScale(12.5),
              paddingLeft: scale(15),
            }}
          >
            {(transaction.date as Date).toLocaleDateString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker onChange={onDateChange} value={new Date()} />
        )}

        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Text style={[styles.date, { color: theme.text }]}>Receipt</Text>
          <Text
            style={[
              styles.date,
              { color: colors.neutral500, fontSize: verticalScale(14) },
            ]}
          >
            (Optional)
          </Text>
        </View>
        <ImageIcon
          placeholder="Upload Image"
          file={transaction.image}
          onSelect={(file) => {
            setTransaction({ ...transaction, image: file });
          }}
          onClear={() => {
            setTransaction({ ...transaction, image: null });
          }}
        />
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: isDark ? colors.neutral700 : colors.neutral200,
          paddingHorizontal: scale(18),
          paddingTop: verticalScale(10),
          paddingBottom: bottom + verticalScale(10),
          flexDirection: "row",
        }}
      >
        {oldTransaction?.id && (
          <TouchableButton
            style={{ marginRight: scale(8), backgroundColor: colors.rose }}
            onPress={handleDeleteTransaction}
            loading={Deleteloading}
          >
            <Icons.TrashIcon color={"white"} />
          </TouchableButton>
        )}
        <TouchableButton
          loading={loading}
          onPress={onSubmit}
          style={{ flex: 1 }}
        >
          <Text style={{ fontWeight: "700", fontSize: verticalScale(16) }}>
            {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          </Text>
        </TouchableButton>
      </View>
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  main: { flex: 1 },
  headerContainer: {
    marginBottom: verticalScale(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  dropdownCont: {
    height: verticalScale(54),
    borderWidth: 1,
    paddingHorizontal: scale(15),
    borderCurve: "continuous",
    borderRadius: verticalScale(15),
  },

  selectedTextStyle: {
    fontSize: verticalScale(14),
  },
  iconStyle: {
    height: verticalScale(30),
    tintColor: colors.neutral500,
  },
  date: { fontWeight: 500, fontSize: verticalScale(18) },
  itemContainerStyle: {
    borderRadius: verticalScale(15),
    marginHorizontal: scale(6),
  },
  containerStyle: {
    borderRadius: verticalScale(15),
    borderCurve: "continuous",
    overflow: "hidden",
    top: 2,
    paddingVertical: verticalScale(5),
    elevation: 15,
  },
});
