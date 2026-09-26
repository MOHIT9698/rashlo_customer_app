import { CartProvider } from "@/context/CartContext";
import { ShopProvider } from "@/context/ShopContext";
import {
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from "@expo-google-fonts/nunito-sans";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";



export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });


  if (!fontsLoaded) {
    return null;
  }

  return (
    <ShopProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="tabs" />
          <Stack.Screen
            name="add-item/[categoryId]"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="order/[id]" />

        </Stack>
      </CartProvider>
    </ShopProvider>
  )

    ;
}
