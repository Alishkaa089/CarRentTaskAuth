import SignInForm from "@/components/screens/signin/sign-in.form";
import SignUpForm from "@/components/signup/sign-up.form";
import { layoutTheme } from "@/constant/theme";
import useTheme from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme.type";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    return (
        <SafeAreaView style={styles.container}>


            {/* Title */}
            <Text style={styles.title}>{`Getting Started`}</Text>

            {/* Welcome Message */}
            <View style={styles.welcomeBox}>
                <Text style={styles.welcomeText}>Create an account to continue!</Text>
            </View>

            {/* Sign In Form */}
            <SignUpForm />
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "dark" ? layoutTheme.colors.background.primary : layoutTheme.colors.background.white,
        paddingHorizontal: 36,
        paddingTop: 22,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 16,
        marginBottom: 32,
    },
    locationText: {
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        fontWeight: "500",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
        marginBottom: 16,
    },
    welcomeBox: {
        borderRadius: 8,
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 16,
        color: theme === "dark" ? layoutTheme.colors.text.white : layoutTheme.colors.text.primary,
    },
})
