import { Stack } from "expo-router";
import useLayoutFonts from "@/hooks/use-fonts";
import { interFont, montserratFont } from "@/constant/fonts";
import ThemeProvider from "@/context/theme-provider";


export default function RootLayout() {
  const { loaded, error } = useLayoutFonts({ ...interFont, ...montserratFont }) // {...interFont, ...montserratFont} is used to load the fonts

  if (!loaded || error) return null;
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home/page" />
        <Stack.Screen name="(tabs)/index" />
      </Stack>
    </ThemeProvider>
  )
}
