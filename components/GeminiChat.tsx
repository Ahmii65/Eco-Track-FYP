import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { RefObject, useMemo } from "react";
import { StyleSheet, Text } from "react-native";

type refProps = {
  bottomSheetModalRef: RefObject<BottomSheetModal | null>;
};

const GeminiChat = ({ bottomSheetModalRef }: refProps) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const { isDark } = useTheme();
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={1}
      backgroundStyle={{
        backgroundColor: isDark ? colors.neutral700 : colors.neutral300,
      }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default GeminiChat;

const styles = StyleSheet.create({});
