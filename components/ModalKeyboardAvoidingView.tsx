import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ModalKeyboardAvoidingView: React.FC<Props> = ({ children, style }) => {
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView behavior="padding" style={style}>
        {children}
      </KeyboardAvoidingView>
    );
  }

  // On Android with windowSoftInputMode="adjustResize" (Expo default),
  // the screen height shrinks when keyboard opens.
  // Since the modal uses { flex: 1, justifyContent: 'flex-end' },
  // the content automatically rides up with the keyboard.
  // Adding extra padding or KeyboardAvoidingView here would double the space.
  return <View style={style}>{children}</View>;
};

export default ModalKeyboardAvoidingView;
