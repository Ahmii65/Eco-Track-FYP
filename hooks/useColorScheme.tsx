import { useThemeContext } from "@/contexts/ThemeContext";

const useTheme = () => {
  const { theme, isDark } = useThemeContext();
  return { theme, isDark };
};

export default useTheme;
