import Loading from "@/components/Loading";
import WalletList from "@/components/WalletList";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import useFetch from "@/hooks/useFetch";
import { WalletType } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import { Plus } from "phosphor-react-native";
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
    <View style={[styles.main, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: top + verticalScale(10),
          },
        ]}
      >
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>Rs {getUpdatedBalance()}</Text>
        </View>
      </LinearGradient>

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.text }]}>
            My Wallets
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/AddWallet");
            }}
            style={styles.addButton}
          >
            <Plus size={scale(20)} color={colors.primary} weight="bold" />
          </TouchableOpacity>
        </View>

        {loading && <Loading />}
        {error && (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: theme.text }]}>
              {error}
            </Text>
          </View>
        )}
        {wallets.length === 0 && !loading && (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No Wallets Found
            </Text>
          </View>
        )}

        <FlatList
          data={wallets}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  },
  header: {
    height: verticalScale(220),
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(40),
  },
  balanceContainer: {
    alignItems: "center",
    gap: verticalScale(5),
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: verticalScale(14),
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: verticalScale(36),
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    marginTop: -verticalScale(30),
    borderTopRightRadius: scale(30),
    borderTopLeftRadius: scale(30),
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(10),
  },
  listTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: "rgba(163, 230, 53, 0.15)", // Light green tint based on primary
    padding: scale(8),
    borderRadius: scale(12),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(40),
  },
  errorText: {
    fontSize: verticalScale(16),
    fontWeight: "500",
  },
  emptyText: {
    fontSize: verticalScale(14),
    fontWeight: "500",
    opacity: 0.6,
  },
  listContent: {
    paddingBottom: verticalScale(20),
  },
});
