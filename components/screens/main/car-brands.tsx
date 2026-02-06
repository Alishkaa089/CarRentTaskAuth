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
                renderItem={({ item }) =>
                    <TouchableOpacity style={styles.item}>
                        <Image source={{ uri: item.image }} style={styles.brandImage} />
                        <Text style={styles.brandName}>{item.brand}</Text>
                        <Text style={styles.modelName}>{item.model}</Text>
                        <View style={styles.modelInfo}>
                            <Text style={styles.modelYear}>{item.year}</Text>
                            <Text style={styles.modelPrice}>{item.pricePerDay}/day</Text>
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
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    list: {
        gap: 10,
        marginTop: 16,
    },
    item: {
        width: 304,
        height: 234,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.background.gray,
        borderRadius: 10,
        padding: 10,
    },
    brandImage: {
        width: "100%",
        height: 144,
        borderRadius: 10,
        backgroundColor: layoutTheme.colors.background.white,
    },
    modelInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    brandName: {
        fontFamily: layoutTheme.fonts.inter.medium,
        fontSize: 18,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    modelName: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    modelYear: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    modelPrice: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
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
    viewAllButtonText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        color: layoutTheme.colors.text.secondary,
    },
})