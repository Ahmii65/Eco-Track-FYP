import TouchableButton from "@/components/TouchableButton";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Home = () => {
  const handlesignOut = async () => {
    await signOut(auth);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <TouchableButton loading={false} onPress={handlesignOut}>
        <Text>Log Out</Text>
      </TouchableButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
