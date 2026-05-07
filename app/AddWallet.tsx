import BackButton from "@/components/BackButton";
import ImageIcon from "@/components/ImageIcon";
import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { TrashIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
const AddWallet = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const [wallet, setWallet] = useState<WalletType>({ name: "", image: null });
  const [loading, setLoading] = useState<boolean>(false);
  const initialWalletRef = useRef<WalletType | null>(null);
  const [Deleteloading, setDeleteLoading] = useState<boolean>(false);

  const oldWallet: { id: string; name: string; image: string } =
    useLocalSearchParams();
  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please Fill all the fields");
      return;
    }
    if (oldWallet?.id && initialWalletRef.current) {
      const noNameChange =
        name.trim() === initialWalletRef.current.name?.trim();
      const noImageChange = image === initialWalletRef.current.image;
      if (noNameChange && noImageChange) {
        Alert.alert("Wallet", "Nothing to update");
        return;
      }
    }
    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) {
      data.id = oldWallet?.id;
    }
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    // console.log(res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  useEffect(() => {
    if (oldWallet?.id) {
      const initialWallet = {
        name: oldWallet?.name,
        image: oldWallet?.image,
      };
      setWallet(initialWallet);
      initialWalletRef.current = initialWallet;
    }
  }, []);

  const handleDeleteWallet = () => {
    Alert.alert("Confirm", "Are you sure you want to delete Wallet", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(true);
            await deleteWallet(oldWallet?.id);
            // router.back();
          } catch (err) {
            Alert.alert("Wallet", "Failed to delete wallet");
          } finally {
            setDeleteLoading(false);
            Alert.alert("Wallet", "Wallet and associated transactions deleted");
          }
        },
      },
    ]);
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
      <View style={styles.header}>
        <BackButton />
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {oldWallet?.id ? "Edit Wallet" : "Add Wallet"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Wallet Name</Text>
          <TextInput
            placeholder="e.g. Primary Spending"
            placeholderTextColor={
              isDark ? colors.neutral500 : colors.neutral400
            }
            value={wallet.name}
            onChangeText={(value) => setWallet({ ...wallet, name: value })}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
                color: theme.text,
                borderColor: isDark ? colors.neutral700 : colors.neutral200,
              },
            ]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Wallet Icon</Text>
          <View
            style={[
              styles.imagePickerContainer,
              {
                backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
                borderColor: isDark ? colors.neutral700 : colors.neutral200,
              },
            ]}
          >
            <ImageIcon
              placeholder="Tap to upload icon"
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              containerStyle={{
                backgroundColor: "transparent",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: verticalScale(10),
              }}
              imageStyle={{
                height: scale(120),
                width: scale(120),
                borderRadius: verticalScale(20),
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {oldWallet?.id && (
          <TouchableButton
            style={[
              styles.deleteButton,
              {
                backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
              },
            ]}
            onPress={handleDeleteWallet}
            loading={Deleteloading}
          >
            <TrashIcon
              size={verticalScale(24)}
              color={colors.rose}
              weight="bold"
            />
            <Text style={[styles.deleteButtonText, { color: colors.rose }]}>
              Delete Wallet
            </Text>
          </TouchableButton>
        )}

        <TouchableButton
          loading={loading}
          onPress={onSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
            {oldWallet?.id ? "Update Wallet" : "Create Wallet"}
          </Text>
        </TouchableButton>
      </View>
    </View>
  );
};

export default AddWallet;

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
    width: scale(40), // Matches BackButton width roughly to center title
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    gap: verticalScale(24),
  },
  inputGroup: {
    gap: verticalScale(10),
  },
  label: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  input: {
    padding: verticalScale(16),
    borderRadius: verticalScale(16),
    borderWidth: 1,
    fontSize: verticalScale(16),
  },
  imagePickerContainer: {
    height: verticalScale(160),
    borderRadius: verticalScale(20),
    borderWidth: 1,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
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
    borderWidth: 1,
    borderColor: "transparent", // Can change if needed
  },
  deleteButtonText: {
    fontSize: verticalScale(16),
    fontWeight: "600",
  },
});
