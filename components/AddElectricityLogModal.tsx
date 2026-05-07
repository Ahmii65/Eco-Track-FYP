import ModalKeyboardAvoidingView from "@/components/ModalKeyboardAvoidingView";
import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import {
  createOrUpdateElectricityLog,
  deleteElectricityLog,
} from "@/services/carbonService";
import { ElectricityLogType } from "@/types";
import { Trash, X } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
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
  initialData?: ElectricityLogType | null;
};

const AddElectricityLogModal = ({ visible, onClose, initialData }: Props) => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  const isUpdate = !!initialData?.id;

  const [date, setDate] = useState<Date>(new Date());
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setDate(
          initialData.date && (initialData.date as any).toDate
            ? (initialData.date as any).toDate()
            : new Date(initialData.date as any),
        );
        const val = initialData.kwh;
        setInputValue(val ? val.toString() : "");
      } else {
        // Reset
        setDate(new Date());
        setInputValue("");
      }
    }
  }, [visible, initialData]);

  const onSubmit = async () => {
    const numVal = parseFloat(inputValue);
    if (!numVal || numVal <= 0) {
      Alert.alert("Error", "Please enter a valid amount of kWh");
      Alert.alert("Error", "Please enter a valid amount of kWh");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    const log: ElectricityLogType = {
      id: initialData?.id,
      title: "Electricity Log",
      kwh: numVal,
      date: date,
      uid: user?.uid,
    };
    const res = await createOrUpdateElectricityLog(log, initialData?.id);
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
          await deleteElectricityLog(initialData?.id!);
          setDeleteLoading(false);
          onClose();
        },
      },
    ]);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <ModalKeyboardAvoidingView
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? colors.neutral800 : colors.white },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.text }]}>
              {isUpdate ? "Update Electricity Log" : "Add Electricity Log"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.neutral500} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Amount (kWh)
              </Text>
              <TextInput
                value={inputValue}
                keyboardType="numeric"
                onChangeText={setInputValue}
                placeholder="0"
                placeholderTextColor={colors.neutral500}
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.text },
                ]}
                autoFocus={!isUpdate}
              />
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              {isUpdate && (
                <TouchableButton
                  style={styles.deleteBtn}
                  onPress={handleDelete}
                  loading={deleteLoading}
                >
                  <Trash size={scale(20)} color="white" />
                </TouchableButton>
              )}
              <TouchableButton
                onPress={onSubmit}
                loading={loading}
                style={[styles.saveBtn, { backgroundColor: colors.yellow }]}
              >
                <Text style={[styles.btnText, { color: colors.neutral900 }]}>
                  {isUpdate ? "Update" : "Save Log"}
                </Text>
              </TouchableButton>
            </View>
          </ScrollView>
        </ModalKeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddElectricityLogModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "100%",
    borderRadius: scale(20),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
  },
  closeBtn: {
    padding: scale(5),
    backgroundColor: colors.neutral200,
    borderRadius: scale(20),
  },
  content: {
    gap: verticalScale(20),
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
    borderRadius: verticalScale(12),
    paddingHorizontal: scale(15),
    fontSize: verticalScale(16),
  },
  actionRow: {
    flexDirection: "row",
    paddingTop: verticalScale(10),
    gap: scale(10),
  },
  deleteBtn: {
    backgroundColor: colors.rose,
    width: scale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
  },
  btnText: {
    fontWeight: "700",
    fontSize: verticalScale(16),
  },
});
