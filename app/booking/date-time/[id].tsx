import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app.store";
import { ThemeType } from "@/types/theme.type";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";

const TIME_OPTIONS = Array.from({ length: 24 }).map((_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function DateTimeSelection() {
    const { id } = useLocalSearchParams();
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { selectedCar, bookingDraft, setBookingDraft, checkAvailability, getCarBookings } = useAppStore();
    
    
    const carId = (id as string) ?? selectedCar?.id ?? "";
    const car = selectedCar ?? null;

    const [isTimeModalVisible, setTimeModalVisible] = useState(false);
    const [timeSelectionType, setTimeSelectionType] = useState<"pickup" | "return">("pickup");

    const startDate = bookingDraft.startDate;
    const endDate = bookingDraft.endDate;
    const pickupTime = bookingDraft.pickupTime;
    const returnTime = bookingDraft.returnTime;
    const withDriver = bookingDraft.withDriver;

    
    const existingBookings = getCarBookings(carId);
    const blockedDates: string[] = [];
    existingBookings.forEach((booking) => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const current = new Date(start);
        while (current <= end) {
            blockedDates.push(format(current, "yyyy-MM-dd"));
            current.setDate(current.getDate() + 1);
        }
    });

    const onDayPress = (day: any) => {
        if (blockedDates.includes(day.dateString)) {
            Alert.alert("Date Unavailable", "This date is already booked. Please choose another date.");
            return;
        }

        if (!startDate || (startDate && endDate)) {
            setBookingDraft({ startDate: day.dateString, endDate: null });
        } else if (startDate && !endDate) {
            if (new Date(day.dateString).getTime() < new Date(startDate).getTime()) {
                setBookingDraft({ startDate: day.dateString });
            } else {
                const rangeStart = new Date(startDate);
                const rangeEnd = new Date(day.dateString);
                const cur = new Date(rangeStart);
                let hasBlocked = false;
                while (cur <= rangeEnd) {
                    if (blockedDates.includes(format(cur, "yyyy-MM-dd"))) { hasBlocked = true; break; }
                    cur.setDate(cur.getDate() + 1);
                }
                if (hasBlocked) {
                    Alert.alert("Range Unavailable", "Your selected range includes booked days. Choose a different range.");
                    return;
                }
                setBookingDraft({ endDate: day.dateString });
            }
        }
    };

    
    const markedDates: any = {};
    blockedDates.forEach((d) => {
        markedDates[d] = { color: "rgba(255,0,0,0.12)", textColor: "#E53935" };
    });
    if (startDate) {
        markedDates[startDate] = { startingDay: true, color: layoutTheme.colors.secondary, textColor: "white" };
    }
    if (endDate) {
        markedDates[endDate] = { endingDay: true, color: layoutTheme.colors.secondary, textColor: "white" };
    }
    if (startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        const cur = new Date(s);
        cur.setDate(cur.getDate() + 1);
        while (cur < e) {
            const ds = format(cur, "yyyy-MM-dd");
            markedDates[ds] = { color: "rgba(255,92,0,0.2)", textColor: colorScheme === "dark" ? "white" : "black" };
            cur.setDate(cur.getDate() + 1);
        }
    }

    const todayStr = format(new Date(), "yyyy-MM-dd");

    const handleBooking = () => {
        if (!startDate || !endDate) {
            Alert.alert("Missing Input", "Please select a start and end date.");
            return;
        }
        if (!carId) {
            Alert.alert("Error", "Car not found. Please go back and select a car.");
            return;
        }
        const isAvailable = checkAvailability(carId, startDate, endDate);
        if (!isAvailable) {
            Alert.alert("Not Available", "This vehicle is already booked for those dates. Please choose different dates.");
            return;
        }
        router.push({ pathname: "/booking/overview/[id]", params: { id: carId } });
    };

    const handleTimePress = (time: string) => {
        if (timeSelectionType === "pickup") setBookingDraft({ pickupTime: time });
        else setBookingDraft({ returnTime: time });
        setTimeModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <View style={styles.backIconWrapper}>
                        <Ionicons name="chevron-back" size={20} color={colorScheme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Date & Time</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                
                <View style={styles.driverCard}>
                    <View style={styles.driverTextContainer}>
                        <Text style={styles.driverTitle}>Booking with driver</Text>
                        <Text style={styles.driverSubtitle}>Don't have a driver? book with the driver.</Text>
                    </View>
                    <Switch
                        value={withDriver}
                        onValueChange={(v) => setBookingDraft({ withDriver: v })}
                        trackColor={{ false: "#E5E5E5", true: layoutTheme.colors.secondary }}
                        thumbColor={"#FFF"}
                    />
                </View>

                
                <View style={styles.calendarContainer}>
                    <Calendar
                        markingType="period"
                        minDate={todayStr}
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        theme={{
                            backgroundColor: "transparent",
                            calendarBackground: "transparent",
                            textSectionTitleColor: "#b6c1cd",
                            selectedDayBackgroundColor: layoutTheme.colors.secondary,
                            selectedDayTextColor: "#ffffff",
                            todayTextColor: layoutTheme.colors.secondary,
                            dayTextColor: colorScheme === "dark" ? "#FFF" : "#2d4150",
                            textDisabledColor: colorScheme === "dark" ? "#555" : "#d9e1e8",
                            arrowColor: colorScheme === "dark" ? "#FFF" : "#000",
                            monthTextColor: colorScheme === "dark" ? "#FFF" : "#000",
                            textDayFontFamily: layoutTheme.fonts.inter.regular,
                            textMonthFontFamily: layoutTheme.fonts.inter.bold,
                            textDayHeaderFontFamily: layoutTheme.fonts.inter.medium,
                        }}
                    />
                </View>

                
                <View style={styles.timeRow}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeTitle}>Pick-up time</Text>
                        <TouchableOpacity style={styles.timeSelect} onPress={() => { setTimeSelectionType("pickup"); setTimeModalVisible(true); }}>
                            <Text style={styles.timeText}>{pickupTime}</Text>
                            <Ionicons name="chevron-down" size={20} color={colorScheme === "dark" ? "#FFF" : "#000"} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeTitle}>Return time</Text>
                        <TouchableOpacity style={styles.timeSelect} onPress={() => { setTimeSelectionType("return"); setTimeModalVisible(true); }}>
                            <Text style={styles.timeText}>{returnTime}</Text>
                            <Ionicons name="chevron-down" size={20} color={colorScheme === "dark" ? "#FFF" : "#000"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
                    <Text style={styles.submitTitle}>Continue to Booking</Text>
                </TouchableOpacity>
            </View>

            
            <Modal visible={isTimeModalVisible} transparent animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTimeModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Select {timeSelectionType === "pickup" ? "Pick-up" : "Return"} Time
                        </Text>
                        <FlatList
                            data={TIME_OPTIONS}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const isSelected = (timeSelectionType === "pickup" ? pickupTime : returnTime) === item;
                                return (
                                    <TouchableOpacity style={styles.timeOptionBtn} onPress={() => handleTimePress(item)}>
                                        <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>{item}</Text>
                                        {isSelected && <Ionicons name="checkmark-circle" size={20} color={layoutTheme.colors.secondary} />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { justifyContent: "center", alignItems: "flex-start" },
    backIconWrapper: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", justifyContent: "center", alignItems: "center" },
    headerTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 18, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary },
    content: { flex: 1, paddingHorizontal: 20 },
    driverCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", marginTop: 10, marginBottom: 20 },
    driverTextContainer: { flex: 1 },
    driverTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 16, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary, marginBottom: 4 },
    driverSubtitle: { fontFamily: layoutTheme.fonts.inter.regular, fontSize: 12, color: "#888" },
    calendarContainer: { borderRadius: 16, borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", padding: 10, marginBottom: 24 },
    timeRow: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
    timeContainer: { flex: 1 },
    timeTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 14, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary, marginBottom: 8 },
    timeSelect: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: theme === "dark" ? "#333" : "#E5E5E5", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
    timeText: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 14, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary },
    bottomBar: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: theme === "dark" ? "#333" : "#E5E5E5" },
    submitButton: { backgroundColor: layoutTheme.colors.secondary, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
    submitTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 18, color: "#FFF" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
    modalContent: { backgroundColor: theme === "dark" ? layoutTheme.colors.background.darkGray : layoutTheme.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: "50%" },
    modalTitle: { fontFamily: layoutTheme.fonts.inter.bold, fontSize: 18, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary, marginBottom: 20, textAlign: "center" },
    timeOptionBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme === "dark" ? "#333" : "#E5E5E5" },
    timeOptionText: { fontFamily: layoutTheme.fonts.inter.medium, fontSize: 16, color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary },
    timeOptionTextSelected: { fontFamily: layoutTheme.fonts.inter.bold, color: layoutTheme.colors.secondary },
});
