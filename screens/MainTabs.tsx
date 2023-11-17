import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, Octicons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import MypageScreen from "./MypageScreen";
import HomeScreen from "./HomeScreen";
// import PostingBaseScreen from "./PostingBaseScreen";
import { NavigationTitle } from "../utils/NavHelper";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name={NavigationTitle.home}
                component={HomeScreen}
                options={({ route }) => ({
                    headerTitle: "가능 설문 목록",
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Foundation
                                name="home"
                                size={24}
                                color={focused ? "black" : "gray"}
                            />
                        );
                    },
                })}
            />
            {/* <Tab.Screen
                name="설문 요청"
                component={PostingBaseScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Feather
                                name="plus-circle"
                                size={30}
                                color={focused ? "black" : "gray"}
                            />
                        );
                    },
                }}
            /> */}
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
