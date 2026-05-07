import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { WalletType } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CaretRight } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface WalletListProps {
  index: number;
  item: WalletType;
}

const WalletList = ({ index, item }: WalletListProps) => {
  const { theme, isDark } = useTheme();

  const openWallet = () => {
    router.push({
      pathname: "/AddWallet",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
        amount: item?.amount?.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isDark ? colors.neutral800 : colors.neutral100,
            borderColor: isDark ? colors.neutral700 : "transparent",
            borderWidth: isDark ? 1 : 0,
          },
        ]}
        onPress={openWallet}
        activeOpacity={0.7}
      >
        <View style={styles.contentRow}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.textContainer}>
            <Text
              style={[styles.name, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={styles.amount}>Rs {item.amount}</Text>
          </View>
        </View>

        <CaretRight
          size={verticalScale(18)}
          color={isDark ? colors.neutral500 : colors.neutral400}
          weight="bold"
        />
      </TouchableOpacity>
    </View>
  );
};

export default WalletList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(12),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    borderRadius: verticalScale(14),
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
    flex: 1,
  },
  image: {
    width: scale(48),
    height: scale(48),
    borderRadius: verticalScale(10),
  },
  textContainer: {
    flex: 1,
    gap: verticalScale(4),
  },
  name: {
    fontSize: verticalScale(16),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  amount: {
    fontSize: verticalScale(14),
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.3,
  },
});
