import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { carLogos } from "@/data/car-logo";
import { Image } from "expo-image";
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { useCarState } from "@/store/use-car.state";

export default function BrandList() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { brand, setBrand } = useCarState();

    const handleBrandPress = (slug: string) => {
        setBrand([slug]);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Top Brands</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={carLogos}
                numColumns={3}
                keyExtractor={(item) => item.slug}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.item, brand.includes(item.slug) && styles.activeItem]} 
                        onPress={() => handleBrandPress(item.slug)}
                    >
                        <Image source={{ uri: item.image.source }} style={styles.brandImage} />
                        <Text style={styles.brandName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme === "dark" ? "#333" : "#E5E5E5",
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    headerTitle: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 18,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    listContainer: {
        padding: 20,
        gap: 16,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    item: {
        width: "30%",
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#333" : "#E5E5E5",
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    activeItem: {
        borderColor: layoutTheme.colors.secondary,
        borderWidth: 2,
    },
    brandImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginBottom: 8,
    },
    brandName: {
        fontFamily: layoutTheme.fonts.inter.medium,
        fontSize: 12,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        textAlign: "center",
    }
});
