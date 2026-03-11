import { layoutTheme } from "@/constant/theme";
import { carLogos } from "@/data/car-logo";
import useTheme from "@/hooks/use-theme";
import { useCarState } from "@/store/use-car.state";
import { ThemeType } from "@/types/theme.type";
import { Image } from "expo-image";
import { router } from "expo-router";

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BrandLogo() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { brand, setBrand } = useCarState();

    const handleBrandPress = (slug: string) => {
        setBrand([slug])
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Top Brands</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push("/brand-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={carLogos}
                renderItem={({ item }) =>
                    <TouchableOpacity 
                        style={[styles.item, brand.includes(item.slug) && styles.activeItem]} 
                        onPress={() => handleBrandPress(item.slug)}
                    >
                        <Image source={{ uri: item.image.source }} style={styles.brandImage} />
                    </TouchableOpacity>}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        marginTop: 20,
    },
    list: {
        gap: 12,
        marginTop: 16,
    },
    item: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#333" : "#E5E5E5",
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    activeItem: {
        borderColor: layoutTheme.colors.secondary,
        borderWidth: 2,
    },
    brandImage: {
        width: 44,
        height: 44,
        resizeMode: "contain",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 18,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    viewAllButton: {

    },
    viewAllButtonText: {
        fontFamily: layoutTheme.fonts.inter.medium,
        color: layoutTheme.colors.text.secondary,
        fontSize: 14,
    },
});