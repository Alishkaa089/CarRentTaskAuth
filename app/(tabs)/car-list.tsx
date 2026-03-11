import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { carModels } from "@/data/car-models";
import { Image } from "expo-image";
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";

export default function CarList() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? layoutTheme.colors.white : layoutTheme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Vehicles</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={carModels}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.item}
                        onPress={() => router.push(`/car-details/${item.id}`)}
                    >
                        <Image source={{ uri: item.image }} style={styles.brandImage} contentFit="cover" />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.brandName} numberOfLines={1}>white {item.brand} {item.model} - Elite State</Text>
                            <View style={styles.modelInfo}>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#FFB800" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                    <Text style={styles.reviewText}>[140+ Review]</Text>
                                </View>
                                <Text style={styles.modelPrice}>${item.pricePerDay}<Text style={styles.dayText}> /day</Text></Text>
                            </View>
                        </View>
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
        borderBottomColor: theme === "dark" ? "#33" : "#E5E5E5",
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
    item: {
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.background.gray,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: theme === "dark" ? "#333" : "#E5E5E5",
    },
    brandImage: {
        width: "100%",
        height: 180,
        borderRadius: 12,
        backgroundColor: layoutTheme.colors.background.white,
        marginBottom: 12,
    },
    detailsContainer: {
        paddingHorizontal: 4,
    },
    brandName: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 8,
    },
    modelInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    dayText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 12,
        color: "#888",
    },
});