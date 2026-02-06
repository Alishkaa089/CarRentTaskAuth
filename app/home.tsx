import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    const data = [
        { id: 1, title: "Car 1" },
        { id: 2, title: "Moto" },
        { id: 3, title: "Car 3" },
        { id: 4, title: "Car 4" },
        { id: 5, title: "Car 5" },
        { id: 6, title: "Car 6" },
        { id: 7, title: "Car 7" },
        { id: 8, title: "Car 8" },
        { id: 9, title: "Car 9" },
        { id: 10, title: "Car 10" },
    ];
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>Home Without Tabs Layout</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => <View style={styles.item}><Text>{item.title}</Text></View>}
                horizontal
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    list: {
        flex: 1,
        gap: 10,
        marginTop: 16,
    },
    title: {
        fontSize: 20,
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
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
        elevation: 5,
    },
});