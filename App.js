import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SurveyPostingScreen from "./screens/SurveyPostingScreen";
const Stack = createStackNavigator();

import MainTabs from "./screens/MainTabs";
import SurveyParticipateScreen from "./screens/SurveyParticipateScreen";
import { colors } from "./utils/colors";
import { Provider } from "react-redux";
import store from "./store";
import { NavigationTitle } from "./utils/NavigationTitle";
import CustomNavButton from "./components/posting/CustomNavButton";
import { log } from "./utils/Log";
import ImageButton from "./components/ImageButton";

// const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name={NavigationTitle.mainTabs}
                        component={MainTabs}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name={NavigationTitle.participate}
                        component={SurveyParticipateScreen}
                        options={{
                            headerBackTitleVisible: false,
                            // TODO: 개발 끝나면 false 로 처리하기.
                            // headerShown: false,
                            headerStyle: { backgroundColor: colors.background },
                        }}
                    />
                    <Stack.Screen
                        name={NavigationTitle.posting}
                        component={SurveyPostingScreen}
                        options={{
                            headerBackTitleVisible: false,
                            headerStyle: {
                                backgroundColor: colors.background,
                            },
                            headerRight: () => {
                                // <CustomNavButton
                                //     img={require("../SurvyFront/assets/sendIcon.png")}
                                // />;
                                // <CustomNavButton
                                //     img={require("../SurvyFront/assets/sendIcon.png")}
                                //     onPress={log}
                                // />;
                                <ImageButton
                                    // img={require("../SurvyFront/assets/sendIcon.png")}
                                    img={require("./assets/selectedSingleSelection.png")}
                                />;
                            },
                        }}
                    />
                </Stack.Navigator>
                {/* <Text style={styles.requestButton}>ansdj</Text> */}
            </NavigationContainer>
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
