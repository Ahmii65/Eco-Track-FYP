import TouchableButton from "@/components/TouchableButton";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
const Home = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const handlesignOut = async () => {
    await signOut(auth);
  };
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5
        },
      ]}
    >
      <TouchableButton loading={false} onPress={handlesignOut}>
        <Text>Log Out</Text>
      </TouchableButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
});
