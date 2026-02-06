import { ThemeContext } from "@/hooks/use-theme-context";
import { ThemeType } from "@/types/theme.type";
import { useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {

    const [appTheme, setAppTheme] = useState<ThemeType>("system");
    const systemColorScheme = useSystemColorScheme();

    const toggleTheme = (theme: ThemeType) => {
        setAppTheme(theme);
    }

    const getColorSchema = (): "light" | "dark" => {
        if (appTheme === "light") return "light";
        if (appTheme === "dark") return "dark";
        return systemColorScheme === "light" ? "light" : "dark";
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: appTheme,
                colorScheme: getColorSchema(),
                toggleTheme: toggleTheme,
            }}>
            {children}
        </ThemeContext.Provider>
    )

}