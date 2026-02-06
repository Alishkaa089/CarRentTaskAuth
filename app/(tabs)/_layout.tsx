import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { ThemeType } from "@/types/theme.type"
import { StyleSheet } from "react-native"
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";

export default function TabsLayout() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarStyle:  styles.tabBar}} >
            <Tabs.Screen name="index" options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />
            }}
            />
            <Tabs.Screen name="favorite" 
            options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />
            }}
            />
            <Tabs.Screen name="notifications" 
            options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />
            }}
            />
            <Tabs.Screen name="profile" 
            options={{
                title: "",
                tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />
            }}
            />
            <Tabs.Screen name="car-list" 
            options={{
                title: "",
                href: null,
            }}
            />
        </Tabs >
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    tabBar: {
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    }
})