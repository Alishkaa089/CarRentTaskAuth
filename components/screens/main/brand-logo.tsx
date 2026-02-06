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
    console.log(brand);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Top Brands</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push("/car-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={carLogos}
                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.item} onPress={() => handleBrandPress(item.slug)}>
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
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 18,
    },
    list: {
        gap: 10,
        marginTop: 16,
    },
    item: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.3)",
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

    },
    brandImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: "contain",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 22,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    viewAllButton: {

    },
    viewAllButtonText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        color: layoutTheme.colors.text.secondary,
    },
});