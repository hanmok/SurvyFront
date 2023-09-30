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
import LoginScreen from "./screens/LoginScreen";
import MyinfoScreen from "./screens/MyinfoScreen";
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
import GreetingComponent from "./GreetingComponent";
import { useEffect } from "react";

// const client = new ApolloClient({
//     uri: API_BASE_URL,
//     cache: new InMemoryCache(),
// });

async function fetchGreeting() {
    // const response = await fetch("http://localhost:4000/graphql", {
    const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: "query { greeting }",
        }),
    });
    const { data } = await response.json();
    return data.greeting;
}

export default function App() {
    useEffect(() => {
        console.log("hi");
        fetchGreeting()
            .then(greeting => {
                console.log(`fetchGreeting called, fetched: ${greeting}`);
                console.log(greeting);
            })
            .catch(err => {
                console.log(`fetchGreeting called, error: ${err.message}`);
            });
    });

    return (
        // <ApolloProvider client={{ client }}>
        <ApolloProvider>
            <Provider store={store}>
                <MenuProvider>
                    {/* <GreetingComponent /> */}
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
                        </Stack.Navigator>
                    </NavigationContainer>
                </MenuProvider>
            </Provider>
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

// const fetchGreeting = async () => {
//     console.log("fetchGreeting called");
//     const response = await fetch(API_BASE_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             query: "query { greeting }",
//         }),
//     });

//     const { data } = await response.json();
//     // console.log(`data: `)
//     logObject("gql test, data: ", data);
//     return data.greeting;
// };

// fetchGreeting().then(greeting => {
//     console.log(`greeting: ${greeting}`);
// });
