import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

const Tab = createBottomTabNavigator();

import MypageView from "./SettingsScreen";
import HomeView from "./HomeScreen";
import SurveyParticipateScreen from "./SurveyParticipateScreen";
import SurveyRequestScreen from "./SurveyRequestScreen";

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="홈"
                component={HomeView}
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
                name="설문 요청"
                component={SurveyRequestScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <Image
                                style={{ width: 20, height: 20 }}
                                // source={require("./assets/selectedMypageIcon.jpg")}
                                source={require("../assets/selectedUploadIcon.jpg")}
                            />
                        ) : (
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../assets/unselectedUploadIcon.jpg")}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="마이페이지"
                component={MypageView}
                options={{
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
