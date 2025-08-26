import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Metal Prices" }} />
      <Stack.Screen name="details" options={{ title: "Metal Details" }} />
    </Stack>
  );
}
