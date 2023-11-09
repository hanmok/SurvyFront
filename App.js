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
// import { NavigationTitle } from "./utils/NavigationTitle";
import { NavigationTitle } from "./utils/NavHelper";
import CustomNavButton from "./components/posting/CustomNavButton";
import { log } from "./utils/Log";
import ImageButton from "./components/ImageButton";
import { MenuProvider } from "react-native-popup-menu";
import ParticipatedSurveysScreen from "./screens/ParticipatedSurveysScreen";
import PostedSurveysScreen from "./screens/PostedSurveysScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginScreen from "./screens/login/LoginScreen";
import MyinfoScreen from "./screens/MyinfoScreen";
import { MyProvider } from "./screens/MyContext";

// import {
//     ApolloProvider,
//     ApolloClient,
//     InMemoryCache,
//     gql,
//     useQuery,
// } from "@apollo/client";

import { gql, useQuery } from "@apollo/client";
import { ApolloProvider } from "./ApolloProvider";
import { API_BASE_URL, GQL_URL } from "./API/API";
import { useEffect } from "react";
import TargettingScreen from "./screens/TargettingScreen";
import { TextInput } from "react-native-gesture-handler";
import ResponseScreen from "./screens/ResponseScreen";
import ParticipatingEndScreen from "./screens/ParticipatingEndScreen";
import FindIDScreen from "./screens/login/FindIDScreen";

// const client = new ApolloClient({
//     uri: API_BASE_URL,
//     cache: new InMemoryCache(),
// });

// TextInput.defaultProps.autoCorrect = false;

export default function App() {
    return (
        // <ApolloProvider client={{ client }}>
        <ApolloProvider>
            <MyProvider>
                <Provider store={store}>
                    <MenuProvider>
                        <NavigationContainer>
                            <Stack.Navigator>
                                {/* 테스트 용으로 막아둠 */}
                                {/* <Stack.Screen
                                name={NavigationTitle.login}
                                component={LoginScreen}
                                options={{
                                    headerShown: false,
                                }}
                            /> */}

                             <Stack.Screen
                                //  name={NavigationTitle.findID}
                                name="아이디 찾기"
                                 component={FindIDScreen}
                                //  options={{
                                //      headerShown: false,
                                //  }}
                                /> 


                            {/* <Stack.Screen
                                name={NavigationTitle.endParticipation}
                                component={ParticipatingEndScreen}
                                options={{
                                    headerShown: false,
                                }}
                            /> */}

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
                                        // headerBackTitleVisible: false,
                                        // headerback
                                        // headerLeft: null,
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
                                        headerRight: () => (
                                            <ImageButton
                                                img={require("./assets/selectedSingleSelection.png")}
                                            />
                                        ),
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

                                <Stack.Screen
                                    name={NavigationTitle.myinfo}
                                    component={MyinfoScreen}
                                    options={{
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    }}
                                />
                                <Stack.Screen
                                    name={NavigationTitle.targetting}
                                    component={TargettingScreen}
                                    options={{ headerBackTitleVisible: false }}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.response}
                                    component={ResponseScreen}
                                    options={{
                                        headerBackTitleVisible: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={NavigationTitle.endParticipation}
                                    component={ParticipatingEndScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </MenuProvider>
                </Provider>
            </MyProvider>
        </ApolloProvider>
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
