import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, Text } from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

import MypageScreen from "./MypageScreen";
import HomeScreen from "./HomeScreen";
import SurveyParticipateScreen from "./ParticipatingScreen";
import PostingScreen from "./PostingScreen";
import PostingBaseScreen from "./PostingBaseScreen";
import { NavigationTitle } from "../utils/NavHelper";

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name={NavigationTitle.home}
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Foundation
                                name="home"
                                size={24}
                                color={focused ? "black" : "gray"}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="설문 요청"
                // component={PostingScreen}
                // name=""
                component={PostingBaseScreen}
                options={{
                    // headerShown: false,
                    // tabBarLabel: "",
                    tabBarIcon: ({ focused }) => {
                        return (
                            // <Octicons
                            //     name="upload"
                            //     size={24}
                            //     color={focused ? "black" : "gray"}
                            // />
                            <Feather
                                name="plus-circle"
                                // size={24}
                                size={30}
                                color={focused ? "black" : "gray"}
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
                        return (
                            <Ionicons
                                name="person"
                                size={24}
                                color={focused ? "black" : "gray"}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}
