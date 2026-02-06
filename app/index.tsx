import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "expo-image";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function Index() {
  const width = useWindowDimensions().width;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      setIsAuthenticated(false);
    } else if (isAuthenticated === "true") {
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    checkAuthenticated();
  }, [])

  return (
    !isAuthenticated ? (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/audi.jpg")}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={styles.content}>
            <Text style={{ ...styles.title, width: width - 108 }}>Find and rent car in easy steps.</Text>

            {/* Let's Go Button */}
            <Pressable style={styles.button} onPress={() => router.push("/signin")}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>{`Let's Go`}</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    ) : (
      <Redirect href="/(tabs)" />
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 106,
  },
  title: {
    color: "white",
    fontSize: 48,
    marginTop: 110,
    marginRight: 108,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#FF5C00",
    maxWidth: 324,
    width: "100%",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
  }
});
