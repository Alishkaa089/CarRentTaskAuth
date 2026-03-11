import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { useAppStore, PaymentCard } from "@/store/use-app.store";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert, Dimensions, KeyboardAvoidingView, Modal,
    Platform, ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { format } from "date-fns";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_H * 0.45;

export default function BookingOverview() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const {
        selectedCar,
        bookingDraft,
        paymentCards,
        activeCard,
        addPaymentCard,
        setActiveCard,
        addBooking,
    } = useAppStore();

    const car = selectedCar!;
    const { startDate, endDate, pickupTime, returnTime, withDriver } = bookingDraft;

    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>("Getting location…");

    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setAddress("Location permission denied");
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = loc.coords;
                setCoords({ lat: latitude, lng: longitude });

                const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geo) {
                    const parts = [geo.street, geo.district, geo.city].filter(Boolean);
                    setAddress(parts.join(", "));
                } else {
                    setAddress("Current location");
                }
            } catch {
                setAddress("Location unavailable");
            }
        })();
    }, []);

    
    const mapHtml = coords
        ? `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    #map { width:100vw; height:100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false, attributionControl: false })
               .setView([${coords.lat}, ${coords.lng}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var icon = L.divIcon({
      className: '',
      html: '<div style="width:22px;height:22px;background:#FF5C00;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>',
      iconSize:[22,22], iconAnchor:[11,11]
    });
    L.marker([${coords.lat}, ${coords.lng}], {icon}).addTo(map);
  </script>
</body>
</html>`
        : `<!DOCTYPE html>
<html>
<body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#E5E5E5;font-family:sans-serif;color:#888;">
  <div style="text-align:center"><div style="font-size:40px">📍</div><p style="margin-top:8px">Locating you…</p></div>
</body>
</html>`;

    
    const sDate = new Date(startDate ?? new Date());
    const eDate = new Date(endDate ?? new Date());
    const startDateStr = format(sDate, "d MMM yyyy");
    const endDateStr = format(eDate, "d MMM yyyy");
    const days = Math.max(1, Math.ceil((eDate.getTime() - sDate.getTime()) / (1000 * 3600 * 24)));
    const totalPrice = (car?.pricePerDay ?? 0) * days;
    const doors = car?.type?.toLowerCase().match(/coupe|sports|roadster/) ? "2" : "4";

    
    const handleCardNumberChange = (text: string) => setCardNumber(text.replace(/[^0-9]/g, "").slice(0, 16));

    const handleCardExpiryChange = (text: string) => {
        let cleaned = text.replace(/[^0-9]/g, "");
        if (cleaned.length >= 2) {
            const month = parseInt(cleaned.substring(0, 2), 10);
            if (month > 12) cleaned = "12" + cleaned.substring(2);
            else if (month === 0) cleaned = "01" + cleaned.substring(2);
        }
        if (cleaned.length === 4) {
            const year = parseInt(cleaned.substring(2, 4), 10);
            if (year < 26) cleaned = cleaned.substring(0, 2) + "26";
        }
        if (cleaned.length > 2) cleaned = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
        setCardExpiry(cleaned);
    };

    const handleCardCvvChange = (text: string) => setCardCvv(text.replace(/[^0-9]/g, "").slice(0, 3));

    const detectCardType = (num: string): PaymentCard["type"] => {
        if (num.startsWith("4")) return "visa";
        if (num.startsWith("5") || num.startsWith("2")) return "mastercard";
        if (num.startsWith("3")) return "amex";
        return "other";
    };

    const handleSaveCard = () => {
        if (cardNumber.length < 16) { Alert.alert("Invalid Card", "Please enter a valid 16-digit card number."); return; }
        if (cardExpiry.length < 5) { Alert.alert("Invalid Expiry", "Please enter a valid expiry date (MM/YY)."); return; }
        if (cardCvv.length < 3) { Alert.alert("Invalid CVV", "Please enter a valid 3-digit CVV."); return; }

        const newCard: PaymentCard = {
            id: Date.now().toString(),
            lastFour: cardNumber.slice(-4),
            expiry: cardExpiry,
            type: detectCardType(cardNumber),
        };
        addPaymentCard(newCard);
        setPaymentModalVisible(false);
        setCardNumber(""); setCardExpiry(""); setCardCvv("");
    };

    const handlePayAndBook = () => {
        if (!activeCard) { Alert.alert("Missing Payment", "Please add a payment method before booking."); return; }
        if (!startDate || !endDate) { Alert.alert("Missing Dates", "Please go back and select your dates."); return; }

        addBooking({
            id: Date.now().toString(),
            carId: car.id,
            car,
            startDate,
            endDate,
            pickupTime: pickupTime ?? "10:00",
            returnTime: returnTime ?? "17:00",
            withDriver: withDriver ?? false,
            totalPrice,
            cardLastFour: activeCard.lastFour,
            bookedAt: new Date().toISOString(),
        });
        setSuccessModalVisible(true);
    };

    return (
        <View style={styles.container}>
            
            <View style={styles.mapContainer}>
                <WebView
                    source={{ html: mapHtml }}
                    style={styles.map}
                    scrollEnabled={false}
                    originWhitelist={["*"]}
                    javaScriptEnabled
                />
            </View>

            
            <SafeAreaView style={styles.headerOverlay} edges={["top"]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} color="#000" />
                </TouchableOpacity>
            </SafeAreaView>

            
            <View style={styles.carFloatBox}>
                <Image source={{ uri: car?.image }} style={styles.carImage} contentFit="contain" />
            </View>

            
            <View style={styles.bottomCard}>
                
                <View style={styles.orangeBanner}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.carName} numberOfLines={1}>{car?.brand} {car?.model}</Text>
                        <Text style={styles.carDoors}>{doors} Doors</Text>
                    </View>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={styles.ratingText}> 4.8</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.overviewRow}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Start</Text>
                            <Text style={styles.dateValue}>{startDateStr}</Text>
                            <Text style={styles.dateLabel}>{pickupTime}</Text>
                        </View>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>End</Text>
                            <Text style={styles.dateValue}>{endDateStr}</Text>
                            <Text style={styles.dateLabel}>{returnTime}</Text>
                        </View>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLabel}>Days</Text>
                            <Text style={styles.dateValue}>{days}</Text>
                            <Text style={styles.dateLabel}>${totalPrice}</Text>
                        </View>
                    </View>

                    
                    <Text style={styles.sectionTitle}>Payment</Text>
                    {paymentCards.map((card) => (
                        <TouchableOpacity key={card.id} style={[styles.paymentBox, activeCard?.id === card.id && styles.paymentBoxActive]} onPress={() => setActiveCard(card)}>
                            <View style={styles.paymentLeft}>
                                <View style={styles.mcIcon}>
                                    <View style={[styles.mcCircle, { backgroundColor: card.type === "visa" ? "#1a1f71" : "#EB001B", zIndex: 2 }]} />
                                    {card.type !== "visa" && <View style={[styles.mcCircle, { backgroundColor: "#F79E1B", marginLeft: -10, zIndex: 1 }]} />}
                                </View>
                                <View>
                                    <Text style={styles.paymentMethod}>{card.type.charAt(0).toUpperCase() + card.type.slice(1)}</Text>
                                    <Text style={styles.paymentCardNo}>**** **** **** {card.lastFour}</Text>
                                </View>
                            </View>
                            {activeCard?.id === card.id && <Ionicons name="checkmark-circle" size={22} color={layoutTheme.colors.secondary} />}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.addCardBtn} onPress={() => setPaymentModalVisible(true)}>
                        <Ionicons name="add-circle-outline" size={22} color={layoutTheme.colors.secondary} />
                        <Text style={styles.addCardText}>Add new card</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={[styles.payButton, !activeCard && styles.payButtonDisabled]} onPress={handlePayAndBook}>
                        <Text style={styles.payButtonText}>
                            Pay <Text style={styles.payDivider}>|</Text> ${totalPrice} <Text style={styles.payUnit}>/ {days} days</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            
            <Modal visible={isPaymentModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Payment Card</Text>
                        <TextInput style={styles.input} placeholder="Card Number (16 digits)" keyboardType="numeric" maxLength={16} value={cardNumber} onChangeText={handleCardNumberChange} placeholderTextColor="#888" />
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="MM/YY" keyboardType="numeric" value={cardExpiry} onChangeText={handleCardExpiryChange} maxLength={5} placeholderTextColor="#888" />
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" keyboardType="numeric" maxLength={3} value={cardCvv} onChangeText={handleCardCvvChange} secureTextEntry placeholderTextColor="#888" />
                        </View>
                        <TouchableOpacity style={styles.saveCardButton} onPress={handleSaveCard}>
                            <Text style={styles.saveCardText}>Save Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setPaymentModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            
            <Modal visible={isSuccessModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { alignItems: "center", paddingVertical: 40 }]}>
                        <Ionicons name="checkmark-circle" size={80} color={layoutTheme.colors.secondary} />
                        <Text style={styles.successTitle}>Booking Confirmed!</Text>
                        <Text style={styles.successMessage}>
                            {car?.brand} {car?.model} successfully booked.{"\n"}
                            {startDateStr} → {endDateStr}{"\n"}
                            Total paid: ${totalPrice}
                        </Text>
                        <TouchableOpacity style={styles.saveCardButton} onPress={() => { setSuccessModalVisible(false); router.push("/(tabs)"); }}>
                            <Text style={styles.saveCardText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white },

    
    mapContainer: { width: SCREEN_W, height: MAP_HEIGHT },
    map: { flex: 1 },

    
    headerOverlay: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 },
    backBtn: {
        marginLeft: 16,
        marginTop: 8,
        width: 40, height: 40,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },

    
    carFloatBox: {
        position: "absolute",
        top: MAP_HEIGHT - 70,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 10,
    },
    carImage: { width: SCREEN_W * 0.75, height: 120 },

    
    bottomCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: SCREEN_H - MAP_HEIGHT + 40,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 12,
    },
    orangeBanner: {
        backgroundColor: layoutTheme.colors.secondary,
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 22,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    carName: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 17, color: "#FFF", marginBottom: 4 },
    carDoors: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 13, color: "rgba(255,255,255,0.8)" },
    ratingBox: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    ratingText: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 14, color: "#FFF" },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -12,
    },
    sectionTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 15, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary, marginTop: 18, marginBottom: 10 },
    overviewRow: { flexDirection: "row", gap: 10 },
    dateBox: { flex: 1, borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", borderRadius: 12, padding: 10 },
    dateLabel: { fontFamily: layoutTheme.fonts.inter.regular, fontSize: 11, color: "#888", marginBottom: 3 },
    dateValue: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 13, color: theme === "dark" ? "#FFF" : "#000" },

    paymentBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", borderRadius: 12, padding: 14, marginBottom: 10 },
    paymentBoxActive: { borderColor: layoutTheme.colors.secondary, borderWidth: 2 },
    paymentLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    mcIcon: { flexDirection: "row", alignItems: "center", width: 36 },
    mcCircle: { width: 22, height: 22, borderRadius: 11 },
    paymentMethod: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 14, color: theme === "dark" ? "#FFF" : "#000" },
    paymentCardNo: { fontFamily: layoutTheme.fonts.inter.regular, fontSize: 12, color: "#888", marginTop: 2 },

    addCardBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 13, borderWidth: 1, borderStyle: "dashed", borderColor: layoutTheme.colors.secondary, borderRadius: 12, paddingHorizontal: 14, marginBottom: 4 },
    addCardText: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 14, color: layoutTheme.colors.secondary },

    payButton: { backgroundColor: layoutTheme.colors.secondary, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 16, marginBottom: 10 },
    payButtonDisabled: { backgroundColor: "#ccc" },
    payButtonText: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 18, color: "#FFF" },
    payDivider: { color: "rgba(255,255,255,0.5)" },
    payUnit: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 14, color: "rgba(255,255,255,0.8)" },

    
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 20 },
    modalContent: { backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : "#FFF", borderRadius: 24, padding: 20, paddingBottom: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 18, color: theme === "dark" ? "#FFF" : "#000", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", borderRadius: 12, padding: 15, marginBottom: 15, fontFamily: layoutTheme.fonts.inter.medium, fontSize: 14, color: theme === "dark" ? "#FFF" : "#000" },
    saveCardButton: { backgroundColor: layoutTheme.colors.secondary, paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 10, width: "100%" },
    saveCardText: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 16, color: "#FFF" },
    cancelButton: { paddingVertical: 15, alignItems: "center", marginTop: 5 },
    cancelText: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 14, color: "#888" },

    successTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 22, color: theme === "dark" ? "#FFF" : "#000", marginTop: 16, marginBottom: 10, textAlign: "center" },
    successMessage: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 14, color: "#888", textAlign: "center", lineHeight: 22, marginBottom: 30 },
});
