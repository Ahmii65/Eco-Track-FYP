import useTheme from "@/hooks/useColorScheme";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import BottomSheetContent from "./BottomSheetContent";

type bottomSheetProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
};
const WalletBottomSheet = ({ bottomSheetModalRef }: bottomSheetProps) => {
  const { theme } = useTheme();
  const snapPoints = useMemo(() => ["50%", "95%"], []);
  const handleSheetChanges = useCallback((index: number) => {}, []);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={2}
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <BottomSheetContent />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default WalletBottomSheet;
