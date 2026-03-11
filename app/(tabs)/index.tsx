import BrandLogo from "@/components/screens/main/brand-logo";
import CarBrands from "@/components/screens/main/car-brands";
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { StatusBar, StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

export default function Home() {
    const { colorScheme } = useTheme()
  

    const styles = getStyles(colorScheme);
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.mainTitle}>Find your favourite{"\n"}vechicle.</Text>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search vechicle"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                    />
                </View>

                <BrandLogo />
                <CarBrands />
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    mainTitle: {
        fontSize: 32,
        color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.text.primary,
        fontFamily: layoutTheme.fonts.inter.bold,
        marginTop: 20,
        marginBottom: 25,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
        borderRadius: 24,
        paddingHorizontal: 20,
        height: 56,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#333" : "#E5E5E5",
        boxShadow: "0 4px 10px 0px rgba(0, 0, 0, 0.05)",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.text.primary,
        fontFamily: layoutTheme.fonts.inter.regular,
    },
});