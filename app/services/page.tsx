import { View, Text, StyleSheet } from "react-native";
export default function Services() {
  return (
    <View>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.title}>Services</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
        marginTop: 16,
    },
})