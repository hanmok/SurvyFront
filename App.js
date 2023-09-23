import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PostingScreen from "./screens/PostingScreen";
const Stack = createStackNavigator();

import MainTabs from "./screens/MainTabs";
import ParticipatingScreen from "./screens/ParticipatingScreen";
import { colors } from "./utils/colors";
import { Provider } from "react-redux";
import store from "./store";
import { NavigationTitle } from "./utils/NavigationTitle";
import CustomNavButton from "./components/posting/CustomNavButton";
import { log } from "./utils/Log";
import ImageButton from "./components/ImageButton";
import { MenuProvider } from "react-native-popup-menu";
import ParticipatedSurveysScreen from "./screens/ParticipatedSurveysScreen";
import PostedSurveysScreen from "./screens/PostedSurveysScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginScreen from "./screens/LoginScreen";

// const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <MenuProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name={NavigationTitle.login}
                            component={LoginScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={NavigationTitle.mainTabs}
                            component={MainTabs}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={NavigationTitle.participate}
                            component={ParticipatingScreen}
                            options={{
                                headerBackTitleVisible: false,
                                // TODO: 개발 끝나면 false 로 처리하기.
                                // headerShown: false,
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                            }}
                        />
                        <Stack.Screen
                            name={NavigationTitle.posting}
                            component={PostingScreen}
                            options={{
                                headerBackTitleVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                                headerRight: () => {
                                    <ImageButton
                                        img={require("./assets/selectedSingleSelection.png")}
                                    />;
                                },
                            }}
                        />

                        <Stack.Screen
                            name={NavigationTitle.participatedSurveys}
                            component={ParticipatedSurveysScreen}
                            options={{
                                headerBackTitleVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                            }}
                        />

                        <Stack.Screen
                            name={NavigationTitle.postedSurveys}
                            component={PostedSurveysScreen}
                            options={{
                                headerBackTitleVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                            }}
                        />

                        <Stack.Screen
                            name={NavigationTitle.setting}
                            component={SettingScreen}
                            options={{
                                headerBackTitleVisible: false,
                                headerStyle: {
                                    backgroundColor: colors.background,
                                },
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </MenuProvider>
        </Provider>
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
