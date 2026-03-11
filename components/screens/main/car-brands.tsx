import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { carModels } from "@/data/car-models";
import { Image } from "expo-image";
import { router } from "expo-router";
import { CarModel } from "@/types/car-model.types";
import { useCarState } from "@/store/use-car.state";
import { useAppStore } from "@/store/use-app.store";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CarBrands() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const { brand } = useCarState();
    const { searchQuery } = useAppStore();

    const shuffleCars = (array: CarModel[]) => {
        return [...array].sort(() => Math.random() - 0.5).slice(0, 6);
    };

    const [cars, setCars] = useState(() => shuffleCars(carModels as CarModel[]));

    useEffect(() => {
        setCars(shuffleCars(carModels as CarModel[]));
    }, []);

    const getFilteredCars = () => {
        let base: CarModel[] = carModels as CarModel[];

        if (brand.length > 0) {
            base = base.filter((car) => car.brandSlug === brand[0]);
        }

        if (searchQuery.trim().length > 0) {
            const q = searchQuery.toLowerCase().trim();
            base = base.filter((car) => {
                const fullName = `${car.brand} ${car.model}`.toLowerCase();
                return (
                    fullName.includes(q) ||
                    car.brand.toLowerCase().includes(q) ||
                    car.model.toLowerCase().includes(q) ||
                    car.type.toLowerCase().includes(q) ||
                    car.fuelType.toLowerCase().includes(q) ||
                    car.transmission.toLowerCase().includes(q)
                );
            });
        }

        if (searchQuery.trim().length === 0 && brand.length === 0) {
            return cars;
        }

        return base;
    };

    const filtered = getFilteredCars();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {searchQuery.trim().length > 0
                        ? `Results (${filtered.length})`
                        : "Available Near You"}
                </Text>
                <TouchableOpacity onPress={() => router.push("/car-list")}>
                    <Text style={styles.viewAllButtonText}>See All</Text>
                </TouchableOpacity>
            </View>

            {filtered.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color="#888" />
                    <Text style={styles.emptyText}>No vehicles found for "{searchQuery}"</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => router.push(`/car-details/${item.id}`)}
                        >
                            <Image source={{ uri: item.image }} style={styles.brandImage} contentFit="cover" />
                            <Text style={styles.brandName} numberOfLines={1}>{item.brand} {item.model}</Text>
                            <View style={styles.modelInfo}>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#FFB800" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                    <Text style={styles.reviewText}>[140+ Review]</Text>
                                </View>
                                <Text style={styles.modelPrice}>${item.pricePerDay}<Text style={styles.dayText}> /day</Text></Text>
                            </View>
                        </TouchableOpacity>}
                    horizontal={searchQuery.trim().length === 0 && brand.length === 0}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={searchQuery.trim().length > 0 ? styles.listVertical : styles.list}
                    numColumns={searchQuery.trim().length > 0 ? 1 : 1}
                    key={searchQuery.trim().length > 0 ? "vertical" : "horizontal"}
                />
            )}
        </View>
    );
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
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
        paddingBottom: 20,
        gap: 12,
    },
    emptyText: {
        fontFamily: layoutTheme.fonts.inter.medium,
        fontSize: 14,
        color: "#888",
        textAlign: "center",
    },
    listVertical: {
        gap: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
})