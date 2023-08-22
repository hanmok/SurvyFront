import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeView from "./screens/HomeScreen";
import MypageView from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="홈"
                    component={HomeView}
                    options={{
                        tabBarIcon: () => {
                            // <Ionicons name="selectedHomeIcon" size={30} />
                            return (
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={require("./assets/selectedHomeIcon.jpg")}
                                />
                            );
                        },
                    }}
                />
                <Tab.Screen name="마이페이지" component={MypageView} />
            </Tab.Navigator>
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
