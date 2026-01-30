import useTheme from "@/hooks/useColorScheme";
import { WalletType } from "@/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CaretRightIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
interface WalletListProps {
  index: number;
  item: WalletType;
}
const WalletList = ({ index, item }: WalletListProps) => {
  const { theme } = useTheme();

  const openWallet = () => {
    // console.log(item.id);
    router.push({
      pathname: "/AddWallet",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(18)
        .mass(0.7)
        .stiffness(90)}
    >
      <View style={{ flex: 1, paddingHorizontal: scale(20) }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: verticalScale(15),
          }}
          onPress={openWallet}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              gap: verticalScale(12),
            }}
          >
            <Image
              source={item.image}
              transition={100}
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: verticalScale(10),
              }}
            />
            <View>
              <Text
                style={{
                  color: theme.text,
                  fontWeight: "400",
                  fontSize: verticalScale(16),
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  color: theme.text,
                  fontWeight: "200",
                  fontSize: verticalScale(12),
                }}
              >
                Rs {item.amount}
              </Text>
            </View>
          </View>

          <CaretRightIcon color={theme.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default WalletList;

const styles = StyleSheet.create({});
