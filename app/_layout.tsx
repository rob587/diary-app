import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#4f46e5",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Registra",
          headerTitle: "📝 Registra tappa",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? "700" : "500",
                color: focused ? "#4f46e5" : "#999",
              }}
            >
              📍 Registra
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tappe"
        options={{
          title: "Tappe",
          headerTitle: "🗺️ Le mie tappe",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? "700" : "500",
                color: focused ? "#4f46e5" : "#999",
              }}
            >
              🗺️ Tappe
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
