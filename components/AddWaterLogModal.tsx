import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import {
  createOrUpdateWaterLog,
  deleteWaterLog,
} from "@/services/carbonService";
import { WaterLogType } from "@/types";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

type Props = {
  visible: boolean;
  onClose: () => void;
  initialData?: WaterLogType | null;
};

const AddWaterLogModal = ({ visible, onClose, initialData }: Props) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  const isUpdate = !!initialData?.id;

  const [log, setLog] = useState<WaterLogType>({
    title: "",
    liters: 0,
    date: new Date(),
    uid: user?.uid,
  });

  const [litersInput, setLitersInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setLog({
          id: initialData.id,
          title: initialData.title,
          liters: Number(initialData.liters),
          date: new Date(initialData.date as any),
          uid: initialData.uid,
        });
        setLitersInput(initialData.liters.toString());
      } else {
        // Reset form for new entry
        setLog({
          title: "",
          liters: 0,
          date: new Date(),
          uid: user?.uid,
        });
        setLitersInput("");
      }
    }
  }, [visible, initialData]);

  useEffect(() => {
    if (litersInput) {
      setLog((prev) => ({ ...prev, liters: parseFloat(litersInput) || 0 }));
    }
  }, [litersInput]);

  const onSubmit = async () => {
    if (!log.liters || log.liters <= 0) {
      Alert.alert("Error", "Please enter a valid amount of liters");
      return;
    }

    const finalLog = {
      ...log,
      title: log.title || "Water Log",
      uid: user?.uid,
    };

    setLoading(true);
    const res = await createOrUpdateWaterLog(finalLog, initialData?.id);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleteLoading(true);
          await deleteWaterLog(initialData?.id!);
          setDeleteLoading(false);
          onClose();
        },
      },
    ]);
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || log.date;
    setShowDatePicker(false);
    setLog({ ...log, date: currentDate });
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={[styles.backdrop]} onPress={onClose} />

        {/* Bottom Sheet Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? colors.neutral800 : colors.white },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              {isUpdate ? "Update Log" : "Add Water Log"}
            </Text>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icons.X size={20} color={colors.neutral500} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* <AndroidKeyboardAvoidingView extraOffset={0}> */}
            {/* Main Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Amount (Liters)
              </Text>
              <TextInput
                value={litersInput}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.neutral500}
                onChangeText={setLitersInput}
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.text },
                ]}
                autoFocus={!isUpdate}
              />
            </View>

            {/* Submit Button */}
            <View
              style={{
                flexDirection: "row",
                paddingTop: verticalScale(20),
              }}
            >
              {isUpdate && (
                <TouchableButton
                  style={{
                    backgroundColor: colors.rose,
                    marginRight: 10,
                    width: 50,
                  }}
                  onPress={handleDelete}
                  loading={deleteLoading}
                >
                  <Icons.TrashIcon color="white" />
                </TouchableButton>
              )}
              <TouchableButton
                onPress={onSubmit}
                loading={loading}
                style={{ flex: 1, backgroundColor: colors.primaryLight }}
              >
                <Text style={styles.btnText}>
                  {isUpdate ? "Update" : "Save Log"}
                </Text>
              </TouchableButton>
            </View>

            {/* Extra space for keyboard */}
            {/* <View style={{ height: verticalScale(20) }} /> */}
            {/* </AndroidKeyboardAvoidingView> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddWaterLogModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    borderTopLeftRadius: scale(25),
    borderTopRightRadius: scale(25),
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(20),
    maxHeight: "85%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBarContainer: {
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  handleBar: {
    width: scale(50),
    height: verticalScale(5),
    backgroundColor: colors.neutral300,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 5,
    backgroundColor: colors.neutral200,
    borderRadius: 20,
  },
  scrollContent: {
    gap: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  inputContainer: {
    gap: verticalScale(8),
  },
  label: {
    fontSize: verticalScale(16),
    fontWeight: "500",
  },
  input: {
    height: verticalScale(50),
    borderWidth: 1,
    borderRadius: verticalScale(15),
    paddingHorizontal: scale(15),
    fontSize: verticalScale(16),
  },
  btnText: {
    fontSize: verticalScale(16),
    fontWeight: "bold",
    color: "white",
  },
});
