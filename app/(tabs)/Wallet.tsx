import Loading from "@/components/Loading";
import WalletList from "@/components/WalletList";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { WalletType } from "@/types";
import { router } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
const Wallet = () => {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const { top } = useSafeAreaInsets();
  const {
    data: wallets,
    loading,
    error,
  } = useFetch<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const getUpdatedBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item?.amount || 0);
      return total;
    }, 0);

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: colors.primary,
          paddingTop: top + 5,
        },
      ]}
    >
      <View
        style={{
          height: verticalScale(150),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: verticalScale(30),
            fontWeight: "700",
          }}
        >
          Rs {getUpdatedBalance()}
        </Text>
        <Text
          style={{
            color: colors.white,
            fontSize: verticalScale(16),
            fontWeight: "400",
          }}
        >
          Total Balance
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          borderTopRightRadius: verticalScale(20),
          borderTopLeftRadius: verticalScale(20),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingTop: verticalScale(21),
            paddingHorizontal: scale(20),
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontWeight: "600",
              fontSize: verticalScale(17),
            }}
          >
            My Wallets
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/AddWallet");
            }}
          >
            <Icons.PlusCircleIcon
              size={34}
              weight="fill"
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        {loading && <Loading />}
        {error && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: verticalScale(20),
                fontWeight: "500",
                color: theme.text,
              }}
            >
              {error}
            </Text>
          </View>
        )}
        {wallets.length === 0 && !loading && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: verticalScale(40),
            }}
          >
            <Text
              style={{
                fontSize: verticalScale(14),
                // fontWeight: "500",
                color: theme.text,
              }}
            >
              No Wallets Found
            </Text>
          </View>
        )}

        <FlatList
          data={wallets}
          contentContainerStyle={{
            paddingVertical: verticalScale(24),
            paddingTop: verticalScale(20),
          }}
          renderItem={({ index, item }) => {
            return <WalletList item={item} index={index} />;
          }}
        />
      </View>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    gap: verticalScale(20),
  },
});
