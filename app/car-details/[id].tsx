import { layoutTheme } from "@/constant/theme";
import { carModels } from "@/data/car-models";
import useTheme from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app.store";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function CarDetails() {
    const { id } = useLocalSearchParams();
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const insets = useSafeAreaInsets();
    const { setSelectedCar, clearBookingDraft } = useAppStore();

    const car = carModels.find((c) => c.id === id) || carModels[0];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: car.image }} style={styles.carImage} contentFit="cover" />
                    <TouchableOpacity 
                        style={[styles.backButton, { top: insets.top + 10 }]} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="chevron-back" size={24} color={colorScheme === "dark" ? "#FFF" : "#000"} />
                    </TouchableOpacity>
                    <View style={styles.paginationDots}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.carTitle} numberOfLines={1}>Red {car.brand} - {car.model}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#FFB800" />
                                <Text style={styles.ratingText}> 4.8</Text>
                                <Text style={styles.reviewText}>[140+ Review]</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.heartButton}>
                            <Ionicons name="heart-outline" size={24} color={colorScheme === "dark" ? "#FFF" : "#888"} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Car Info</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Ionicons name="person" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={styles.infoText}>{car.seats} Seats</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="car-outline" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={styles.infoText}>
                                {car.type.toLowerCase().includes('coupe') || car.type.toLowerCase().includes('sports') || car.type.toLowerCase().includes('roadster') ? '2' : '4'} Doors
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="snow" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={styles.infoText}>Air conditioning</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="water" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={styles.infoText}>Fuel info: {car.fuelType}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="options" size={20} color={layoutTheme.colors.secondary} />
                            <Text style={styles.infoText}>{car.transmission}</Text>
                        </View>
                    </View>

                    
                    <View style={{ height: 100 }} /> 
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <TouchableOpacity 
                    style={styles.bookingButton}
                    onPress={() => {
                        setSelectedCar(car);
                        clearBookingDraft();
                        router.push({ pathname: "/booking/date-time/[id]", params: { id: car.id } });
                    }}
                >
                    <Text style={styles.bookingText}>Booking Now</Text>
                    <Text style={styles.bookingPrice}>${car.pricePerDay} <Text style={styles.bookingPriceLabel}>/day</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
    },
    scrollContent: {
        paddingBottom: 0,
    },
    imageContainer: {
        width: "100%",
        height: 350,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.background.gray,
        overflow: "hidden",
        position: "relative",
    },
    carImage: {
        width: "100%",
        height: "100%",
    },
    backButton: {
        position: "absolute",
        left: 20,
        backgroundColor: theme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    paginationDots: {
        position: "absolute",
        bottom: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 184, 0, 0.4)",
    },
    activeDot: {
        backgroundColor: layoutTheme.colors.secondary,
    },
    contentContainer: {
        padding: 20,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    carTitle: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 20,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    reviewText: {
        fontFamily: layoutTheme.fonts.inter.regular,
        fontSize: 14,
        color: "#888",
    },
    heartButton: {
        padding: 4,
    },
    sectionTitle: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 18,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 16,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 24,
    },
    infoItem: {
        width: "45%",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    infoText: {
        fontFamily: layoutTheme.fonts.inter.medium,
        fontSize: 14,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme === "dark" ? layoutTheme.colors.primary : layoutTheme.colors.white,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme === "dark" ? "#333" : "#E5E5E5",
    },
    bookingButton: {
        backgroundColor: layoutTheme.colors.secondary,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    bookingText: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 18,
        color: "#FFF",
    },
    bookingPrice: {
        fontFamily: layoutTheme.fonts.inter.bold,
        fontSize: 20,
        color: "#FFF",
    },
    bookingPriceLabel: {
        fontFamily: layoutTheme.fonts.inter.medium,
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
});
