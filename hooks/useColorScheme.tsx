import { colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

const lightTheme = {
  background: "#FAF9F6",
  text: "black",
};
const darkTheme = {
  background: colors.neutral900,
  text: "white",
};

const useTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  return { theme, isDark };
};

export default useTheme;
