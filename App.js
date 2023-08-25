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
import SurveyParticipateScreen from "./screens/SurveyParticipateScreen";
import { colors } from "./utils/colors";

// const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Participate"
                    component={SurveyParticipateScreen}
                    options={{
                        headerBackTitleVisible: false,
                        // TODO: 개발 끝나면 false 로 처리하기.
                        // headerShown: false,
                        headerStyle: { backgroundColor: colors.background },
                    }}
                />
                <Stack.Screen
                    name="Posting"
                    component={SurveyRequestScreen}
                    options={{
                        headerBackTitleVisible: false,
                        headerStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                />
            </Stack.Navigator>
            {/* <Text style={styles.requestButton}>ansdj</Text> */}
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
    requestButton: {
        position: "absolute",
        bottom: 50,
        alignSelf: "center",
    },
});
