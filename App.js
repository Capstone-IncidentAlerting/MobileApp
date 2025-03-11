import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GetStarted from "./screens/GetStarted";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import ReportIncident from "./screens/ReportIncident";
import ReportIncidentDetails from "./screens/ReportIncidentDetails";
import IncidentList from "./screens/IncidentList";
import Profile from "./screens/Profile";
import IncidentDetails from "./screens/IncidentDetails";
import TestAxiosScreen from "./screens/TestAxiosScreen";

import { AuthProvider } from "./context/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen
          name="GetStarted"
          component={GetStarted}
          options={{ title: "Get Started" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up", headerShown: false, animation: "simple_push", presentation: "modal", }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="ReportIncident"
          component={ReportIncident}
          options={{ title: "Report Incident", headerShown: false }}
        />
        <Stack.Screen
          name="ReportIncidentDetails"
          component={ReportIncidentDetails}
          options={{ title: "Report Incident Details" }}
        />
        <Stack.Screen
          name="IncidentList"
          component={IncidentList}
          options={{ title: "Incident List" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="IncidentDetails"
          component={IncidentDetails}
          options={{ title: "Incident Details" }}
        />
        <Stack.Screen
          name="TestAxiosScreen"
          component={TestAxiosScreen}
          options={{ title: "Test Axios" }}
        />
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
