import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from 'sonner-native';

// Import screens
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import FoodAnalysisScreen from "./screens/FoodAnalysisScreen";
import FoodLogScreen from "./screens/FoodLogScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";

// Import context
import { AIProvider } from './context/AIContext';

// Create stack navigator
const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="FoodAnalysis" component={FoodAnalysisScreen} />
      <Stack.Screen name="FoodLog" component={FoodLogScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AIProvider>
        <Toaster />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AIProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});