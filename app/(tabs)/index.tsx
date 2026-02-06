import BrandLogo from "@/components/screens/main/brand-logo";
import CarBrands from "@/components/screens/main/car-brands";
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const { colorScheme } = useTheme()
  

    const styles = getStyles(colorScheme);
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Home with Tabs Layout</Text>
            <BrandLogo />
            <CarBrands />
            
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    
    title: {
        fontSize: 20,
        color: "green",
        textAlign: "center",
        marginTop: 16,
        fontFamily: layoutTheme.fonts.inter.bold,
    },
    
});