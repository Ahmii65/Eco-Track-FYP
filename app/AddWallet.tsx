import BackButton from "@/components/BackButton";
import ImageIcon from "@/components/ImageIcon";
import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import * as Icons from "phosphor-react-native";
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
            router.back();
          } catch (err) {
            Alert.alert("Wallet", "Failed to delete wallet");
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
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
      <View style={{ paddingHorizontal: scale(20), gap: verticalScale(12) }}>
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
              {oldWallet?.id ? "Update Wallet" : "New Wallet"}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: theme.text,
            fontWeight: 500,
            fontSize: verticalScale(18),
          }}
        >
          Wallet Name
        </Text>
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor={theme.text}
          value={wallet.name}
          onChangeText={(value) => {
            setWallet({ ...wallet, name: value });
          }}
          style={{
            padding: verticalScale(16),
            borderWidth: 1,
            borderColor: theme.text,
            borderRadius: verticalScale(12),
            color: theme.text,
          }}
        />
        <Text
          style={{
            color: theme.text,
            fontWeight: 500,
            fontSize: verticalScale(18),
          }}
        >
          Wallet Icon
        </Text>
        <ImageIcon
          placeholder="Upload Image"
          file={wallet.image}
          onSelect={(file) => {
            setWallet({ ...wallet, image: file });
          }}
          onClear={() => {
            setWallet({ ...wallet, image: null });
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingBottom: bottom + 8,
        }}
      >
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? colors.neutral700 : colors.neutral200,
            paddingHorizontal: scale(18),
            paddingTop: verticalScale(10),
            flexDirection: "row",
          }}
        >
          {oldWallet?.id && (
            <TouchableButton
              style={{ marginRight: scale(8), backgroundColor: colors.rose }}
              onPress={handleDeleteWallet}
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
              {oldWallet.id ? "Update Wallet" : "Add Wallet"}
            </Text>
          </TouchableButton>
        </View>
      </View>
    </View>
  );
};

export default AddWallet;

const styles = StyleSheet.create({
  main: { flex: 1 },
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
