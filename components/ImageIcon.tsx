import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { getfilePath } from "@/services/imageServices";
import { ImageUploadProps } from "@/types";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const ImageIcon = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const { theme, isDark } = useTheme();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      //   allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };
  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[
            {
              height: verticalScale(50),
              backgroundColor: isDark ? colors.neutral700 : colors.neutral300,
              borderRadius: verticalScale(15),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            },
            containerStyle && containerStyle,
          ]}
        >
          <Icons.UploadIcon color={theme.text} />
          {placeholder && (
            <Text style={{ fontSize: verticalScale(15), color: theme.text }}>
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
      )}
      {file && (
        <View style={[imageStyle && imageStyle, styles.image]}>
          <Image
            style={{ flex: 1 }}
            source={getfilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
            <Icons.X size={scale(20)} weight="bold" color={theme.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageIcon;

const styles = StyleSheet.create({
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: verticalScale(15),
    overflow: "hidden",
    borderCurve: "continuous",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(8),
    right: scale(8),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.rose,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
