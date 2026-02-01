import { colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as _useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  theme: typeof lightTheme;
}

const lightTheme = {
  background: "#FAF9F6",
  text: "black",
  // Add other theme keys if they exist in your previous lightTheme
};

const darkTheme = {
  background: colors.neutral900,
  text: "white",
  // Add other theme keys if they exist in your previous darkTheme
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = _useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem("app_theme");
      if (savedMode) {
        setMode(savedMode as ThemeMode);
      }
    } catch (e) {
      console.error("Failed to load theme", e);
    }
  };

  const updateMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem("app_theme", newMode);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  const isDark =
    mode === "dark" || (mode === "system" && systemScheme === "dark");
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode: updateMode, isDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
