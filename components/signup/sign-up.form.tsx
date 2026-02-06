import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { signUpSchema, SignUpSchema } from "./sign-up.schema";

export default function SignUpForm() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignUpSchema) => {
        try {
            await AsyncStorage.setItem("registeredUser", JSON.stringify(data));

            await AsyncStorage.setItem("isAuthenticated", "true");
            await AsyncStorage.setItem("user", JSON.stringify(data));

            router.push("/(tabs)");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>

                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={24} color="#666" style={styles.inputIcon} />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles.signInButtonText}>SIGN UP</Text>
                    <Ionicons name="arrow-forward" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>{`If you already have an account,`} </Text>
                    <TouchableOpacity onPress={() => router.push("/signin")}>
                        <Text style={styles.signUpLink}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )

}


const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : layoutTheme.colors.background.white,
        marginTop: 32,
        justifyContent: "space-between",
    },
    formContainer: {},
    buttonContainer: {},

    label: {
        fontSize: 14,
        color: "#999",
        marginBottom: 12,
        marginTop: 24,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingBottom: 8,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        paddingVertical: 8,
    },
    eyeIcon: {
        padding: 4,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 12,
        marginTop: 4,
    },
    signInButton: {
        backgroundColor: layoutTheme.colors.background.secondary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 40,
        gap: 8,
    },
    signInButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 1,
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    signUpText: {
        fontSize: 14,
        color: "#666",
    },
    signUpLink: {
        fontSize: 14,
        color: "#000",
        fontWeight: "600",
    },
    facebookButton: {
        backgroundColor: "#4267B2",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 24,
        gap: 12,
    },
    facebookIcon: {
        marginRight: 8,
    },
    facebookButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
})