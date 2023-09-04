import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SurveyRequestScreen from "./screens/SurveyRequestScreen";
const Stack = createStackNavigator();

import MainTabs from "./screens/MainTabs";
import SurveyParticipateScreen from "./screens/SurveyParticipateScreen";
import { colors } from "./utils/colors";
import { Provider } from "react-redux";
import store from "./store";
import { NavigationTitle } from "./utils/NavigationTitle";

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
