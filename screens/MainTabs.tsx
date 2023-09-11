import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, Text } from "react-native";

const Tab = createBottomTabNavigator();

import MypageScreen from "./MypageScreen";
import HomeScreen from "./HomeScreen";
import SurveyParticipateScreen from "./ParticipatingScreen";

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="홈"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../assets/selectedHomeIcon.jpg")}
                            />
                        ) : (
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../assets/unselectedHomeIcon.jpg")}
                            />
                        );
                    },
                }}
            />

            <Tab.Screen
                name="마이페이지"
                component={MypageScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <Image
                                style={{ width: 20, height: 20 }}
                                // source={require("./assets/selectedMypageIcon.jpg")}
                                source={require("../assets/selectedMypageIcon.jpg")}
                            />
                        ) : (
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../assets/unselectedMypageIcon.jpg")}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}
