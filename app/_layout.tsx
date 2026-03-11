import { Stack } from "expo-router";
import useLayoutFonts from "@/hooks/use-fonts";
import { interFont, montserratFont } from "@/constant/fonts";
import ThemeProvider from "@/context/theme-provider";

export default function RootLayout() {
  const { loaded, error } = useLayoutFonts({ ...interFont, ...montserratFont })

  if (!loaded || error) return null;
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="car-details/[id]" />
        <Stack.Screen name="booking/date-time/[id]" />
        <Stack.Screen name="booking/overview/[id]" />
        <Stack.Screen name="moto-details" />
        <Stack.Screen name="services/page" />
      </Stack>
    </ThemeProvider>
  )
}
