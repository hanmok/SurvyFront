import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
// import { SurveyRequestScreen } from "./screens/SurveyRequestScreen";
import SurveyRequestScreen from "./screens/SurveyRequestScreen";
const Stack = createStackNavigator();

// import HomeView from "./screens/HomeScreen";
// import MypageView from "./screens/SettingsScreen";

// import { Ionicons } from "@expo/vector-icons";
import MainTabs from "./screens/MainTabs";

// const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SurveyRequestScreen"
                    component={SurveyRequestScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
