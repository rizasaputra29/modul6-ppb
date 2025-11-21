import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, StatusBar, ActivityIndicator } from "react-native";

import { MonitoringScreen } from "./src/screens/MonitoringScreen.js";
import { ControlScreen } from "./src/screens/ControlScreen.js";
import { LoginScreen } from "./src/screens/LoginScreen.js";
import { ProfileScreen } from "./src/screens/ProfileScreen.js";
import { AuthProvider, useAuth } from "./src/context/authContext.js"
import { assertConfig } from "./src/services/config.js";

const Tab = createMaterialTopTabNavigator();

function CustomSplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
      <Image source={require("./assets/icon.png")} style={{ width: 120, height: 120, marginBottom: 20 }} resizeMode="contain" />
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2563eb" }}>IOTWatch</Text>
      <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
    </View>
  );
}

function MainNavigator() {
  const { user, isGuest, loading } = useAuth();

  if (loading) return null;

  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true, // Gesture Navigation
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarIndicatorStyle: { backgroundColor: "#2563eb", top: 0 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", textTransform: "none" },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Monitoring") iconName = "analytics";
          else if (route.name === "Control") iconName = "options";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      {user && (
        <>
          <Tab.Screen name="Control" component={ControlScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    assertConfig();
  }, []);

  if (splashVisible) {
    return <CustomSplashScreen onFinish={() => setSplashVisible(false)} />;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}