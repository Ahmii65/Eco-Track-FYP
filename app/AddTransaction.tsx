import BackButton from "@/components/BackButton";
import ImageIcon from "@/components/ImageIcon";
import TouchableButton from "@/components/TouchableButton";
import { expenseCategories } from "@/constants/data";
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
import { orderBy, Timestamp, where } from "firebase/firestore";
import { TrashIcon } from "phosphor-react-native";
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

  const getDate = (date: Date | string | Timestamp | undefined): Date => {
    if (!date) return new Date();
    if (date instanceof Timestamp) return date.toDate();
    if (typeof date === "string") return new Date(date);
    return date;
  };

  /* Safe constraints for wallets */
  const constraints = React.useMemo(() => {
    if (!user?.uid) return null;
    return [where("uid", "==", user.uid), orderBy("created", "desc")];
  }, [user?.uid]);

  const {
    data: wallets,
    loading: walletLoading,
    error: walletErrors,
  } = useFetch<WalletType>("wallets", constraints);

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
      oldTransaction?.id,
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

  const renderTransactionTypeSelector = () => {
    return (
      <View
        style={[
          styles.segmentContainer,
          { backgroundColor: isDark ? colors.neutral800 : colors.neutral100 },
        ]}
      >
        {(["expense", "income"] as const).map((type) => {
          const isActive = transaction.type === type;
          return (
            <Pressable
              key={type}
              onPress={() => setTransaction({ ...transaction, type })}
              style={[
                styles.segmentButton,
                isActive && {
                  backgroundColor: isDark ? colors.neutral700 : colors.white,
                },
                isActive && !isDark && styles.shadow,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: isActive
                      ? theme.text
                      : isDark
                        ? colors.neutral500
                        : colors.neutral500,
                    fontWeight: isActive ? "700" : "500",
                  },
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: top,
          paddingBottom: bottom,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {oldTransaction?.id ? "Edit Transaction" : "New Transaction"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Input (Hero) */}
        <View style={styles.amountContainer}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>
            PKR
          </Text>
          <TextInput
            value={transaction.amount?.toString()}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={
              isDark ? colors.neutral600 : colors.neutral300
            }
            onChangeText={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              setTransaction({ ...transaction, amount: Number(numericValue) });
            }}
            style={[styles.amountInput, { color: theme.text }]}
          />
        </View>

        {renderTransactionTypeSelector()}

        <View style={styles.formGroup}>
          {/* Wallet Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Wallet</Text>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                  borderColor: "transparent",
                },
              ]}
              placeholderStyle={{
                color: isDark ? colors.neutral400 : colors.neutral500,
                fontSize: verticalScale(14),
              }}
              selectedTextStyle={{
                color: theme.text,
                fontSize: verticalScale(14),
                fontWeight: "500",
              }}
              iconStyle={{ tintColor: theme.text }}
              data={
                wallets.length > 0
                  ? wallets.map((wallet) => ({
                      label: `${wallet?.name} (Rs ${wallet?.amount})`,
                      value: wallet?.id,
                    }))
                  : [{ label: "No wallets found", value: null }]
              }
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              placeholder="Select Wallet"
              onChange={(item) =>
                setTransaction({ ...transaction, walletId: item.value || "" })
              }
              itemTextStyle={{ color: theme.text }}
              itemContainerStyle={{ backgroundColor: theme.background }}
              containerStyle={{
                backgroundColor: theme.background,
                borderRadius: verticalScale(12),
                borderColor: isDark ? colors.neutral700 : colors.neutral200,
              }}
              activeColor={isDark ? colors.neutral800 : colors.neutral200}
            />
          </View>

          {/* Category Selection (Expense Only) */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Category
              </Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: isDark
                      ? colors.neutral800
                      : colors.neutral100,
                    borderColor: "transparent",
                  },
                ]}
                placeholderStyle={{
                  color: isDark ? colors.neutral400 : colors.neutral500,
                  fontSize: verticalScale(14),
                }}
                selectedTextStyle={{
                  color: theme.text,
                  fontSize: verticalScale(14),
                  fontWeight: "500",
                }}
                iconStyle={{ tintColor: theme.text }}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                placeholder="Select Category"
                onChange={(item) =>
                  setTransaction({ ...transaction, category: item.value || "" })
                }
                itemTextStyle={{ color: theme.text }}
                itemContainerStyle={{ backgroundColor: theme.background }}
                containerStyle={{
                  backgroundColor: theme.background,
                  borderRadius: verticalScale(12),
                  borderColor: isDark ? colors.neutral700 : colors.neutral200,
                }}
                activeColor={isDark ? colors.neutral800 : colors.neutral200}
              />
            </View>
          )}

          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Date</Text>
            <Pressable
              style={[
                styles.dateButton,
                {
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                },
              ]}
              onPress={() => setshowDatePicker(true)}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: verticalScale(14),
                  fontWeight: "500",
                }}
              >
                {getDate(transaction.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={getDate(transaction.date)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Description <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              multiline
              placeholder="Add a note..."
              placeholderTextColor={
                isDark ? colors.neutral500 : colors.neutral400
              }
              value={transaction.description}
              onChangeText={(value) =>
                setTransaction({ ...transaction, description: value })
              }
              style={[
                styles.textArea,
                {
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                  color: theme.text,
                },
              ]}
            />
          </View>

          {/* Receipt Upload */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Receipt <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <View
              style={[
                styles.imagePickerContainer,
                {
                  backgroundColor: isDark
                    ? colors.neutral800
                    : colors.neutral100,
                  borderColor: isDark ? colors.neutral700 : colors.neutral200,
                },
              ]}
            >
              <ImageIcon
                placeholder="Tap to upload receipt"
                file={transaction.image}
                onSelect={(file) =>
                  setTransaction({ ...transaction, image: file })
                }
                onClear={() => setTransaction({ ...transaction, image: null })}
                containerStyle={{
                  backgroundColor: "transparent",
                  height: "100%",
                  width: "100%",
                }}
                imageStyle={{
                  height: "100%",
                  width: "100%",
                  borderRadius: verticalScale(12),
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {oldTransaction?.id && (
          <TouchableButton
            style={[
              styles.deleteButton,
              {
                backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              },
            ]}
            onPress={handleDeleteTransaction}
            loading={Deleteloading}
          >
            <TrashIcon
              size={verticalScale(24)}
              color={colors.rose}
              weight="bold"
            />
            <Text style={[styles.deleteButtonText, { color: colors.rose }]}>
              Delete
            </Text>
          </TouchableButton>
        )}

        <TouchableButton
          loading={loading}
          onPress={onSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
            {oldTransaction?.id ? "Update Transaction" : "Save Transaction"}
          </Text>
        </TouchableButton>
      </View>
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
  },
  headerTitle: {
    fontSize: verticalScale(20),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: scale(40),
  },
  content: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
    gap: verticalScale(24),
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(10),
  },
  currencySymbol: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  amountInput: {
    fontSize: verticalScale(40),
    fontWeight: "700",
    textAlign: "center",
    padding: 0,
  },
  segmentContainer: {
    flexDirection: "row",
    borderRadius: verticalScale(12),
    padding: scale(4),
    height: verticalScale(45),
  },
  segmentButton: {
    flex: 1,
    borderRadius: verticalScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  segmentText: {
    fontSize: verticalScale(14),
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formGroup: {
    gap: verticalScale(16),
  },
  inputContainer: {
    gap: verticalScale(8),
  },
  label: {
    fontSize: verticalScale(15),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  optional: {
    fontSize: verticalScale(13),
    fontWeight: "400",
    opacity: 0.6,
  },
  dropdown: {
    height: verticalScale(50),
    borderRadius: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  dateButton: {
    height: verticalScale(50),
    borderRadius: verticalScale(12),
    paddingHorizontal: scale(12),
    justifyContent: "center",
  },
  textArea: {
    height: verticalScale(100),
    borderRadius: verticalScale(12),
    padding: scale(12),
    textAlignVertical: "top",
    fontSize: verticalScale(14),
  },
  imagePickerContainer: {
    height: verticalScale(140),
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  footer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    gap: verticalScale(12),
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: verticalScale(16),
    height: verticalScale(56),
  },
  submitButtonText: {
    color: colors.neutral900,
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  deleteButton: {
    flexDirection: "row",
    gap: scale(8),
    height: verticalScale(56),
    borderRadius: verticalScale(16),
  },
  deleteButtonText: {
    fontSize: verticalScale(16),
    fontWeight: "600",
  },
});
