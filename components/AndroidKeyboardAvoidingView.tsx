import useTheme from "@/hooks/useColorScheme";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View, ViewProps } from "react-native";

interface AndroidKeyboardAvoidingViewProps extends ViewProps {
  children: React.ReactNode;
  extraOffset?: number;
}

const AndroidKeyboardAvoidingView: React.FC<
  AndroidKeyboardAvoidingViewProps
> = ({ children, extraOffset = 0, ...props }) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height + extraOffset);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [extraOffset]);

  if (Platform.OS !== "android") return <>{children}</>;

  return (
    <>
      {children}
      <View
        style={{
          height: keyboardHeight,
          backgroundColor: theme.background,
          width: "100%",
        }}
      />
    </>
  );
};

export default AndroidKeyboardAvoidingView;
