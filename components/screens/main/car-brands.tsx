import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { carModels } from "@/data/car-models";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CarModel } from "@/types/car-model.types";
import { useCarState } from "@/store/use-car.state";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CarBrands() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { brand } = useCarState();

    const shuffleCars = (array: CarModel[]) => {
        const shuffled = array.sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 6);
    }

    const [cars, setCars] = useState(() => shuffleCars(carModels as CarModel[]));

    useEffect(() => {
        setCars(shuffleCars)
    }, [])


    const getCarBySlug = () => {
        if (brand.length > 0) {
            return carModels.filter((car) => car.brandSlug === brand[0]);
        }
        return cars
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Available Near You</Text>
                <TouchableOpacity onPress={() => router.push("/car-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={getCarBySlug()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity 
                        style={styles.item}
                        onPress={() => router.push(`/car-details/${item.id}`)}
                    >
                        <Image source={{ uri: item.image }} style={styles.brandImage} contentFit="cover" />
                        <Text style={styles.brandName} numberOfLines={1}>white {item.brand} {item.model} - Elite State</Text>
                        <View style={styles.modelInfo}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#FFB800" />
                                <Text style={styles.ratingText}>4.8</Text>
                                <Text style={styles.reviewText}>[140+ Review]</Text>
                            </View>
                            <Text style={styles.modelPrice}>${item.pricePerDay}<Text style={styles.dayText}> /day</Text></Text>
                        </View>
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
        marginTop: 24,
    },
    list: {
        gap: 16,
        marginTop: 16,
    },
    item: {
        width: 280,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.background.gray,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#333" : "#E5E5E5",
    },
    brandImage: {
        width: "100%",
        height: 140,
        borderRadius: 12,
        backgroundColor: layoutTheme.colors.background.white,
        marginBottom: 12,
    },
    modelInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    brandName: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    ratingText: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 12,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    reviewText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 12,
        color: "#888",
    },
    modelPrice: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    dayText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 12,
        color: "#888",
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
    viewAllButtonText: {
        fontFamily: layoutTheme.fonts.inter.medium,
        color: layoutTheme.colors.text.secondary,
        fontSize: 14,
    },
})