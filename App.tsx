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
import { NavigationTitle } from "./utils/NavHelper";
import ImageButton from "./components/ImageButton";
import { MenuProvider } from "react-native-popup-menu";
import ParticipatedSurveysScreen from "./screens/ParticipatedSurveysScreen";
import PostedSurveysScreen from "./screens/PostedSurveysScreen";
import SettingScreen from "./screens/mypage/SettingScreen";
import LoginScreen from "./screens/login/LoginScreen";
// import MyinfoScreen from "./screens/mypage/MyInfoScreen";
import MyInfoScreen from "./screens/mypage/MyinfoScreen";
import { ApolloProvider } from "./ApolloProvider";
import TargettingScreen from "./screens/TargettingScreen";
import ResponseScreen from "./screens/ResponseScreen";
import ParticipatingEndScreen from "./screens/ParticipatingEndScreen";
import { LoadingIndicator } from "./features/LoadingIndicator";
import { CustomProvider } from "./features/context/CustomContext";
import FindIDScreen from "./screens/login/FindIDScreen";
import FindPasswordScreen from "./screens/login/FindPasswordScreen";
import PasswordSettingScreen from "./screens/login/PasswordSettingScreen";
import FoundIDScreen from "./screens/login/FoundIDScreen";
import SignUpScreen from "./screens/login/SignupScreen";
import MyGenreScreen from "./screens/mypage/MyGenreScreen";
import Toast from "react-native-toast-message";
import toastConfig from "./components/common/toast/ToastConfig";
import PointHistoryScreen from "./screens/PointHistoryScreen";
import EditingSectionScreen from "./screens/EditingSectionScreen";
import { FontAwesome5 } from "@expo/vector-icons";
// export default function App() {
const App: React.FC = () => {
    return (
        <CustomProvider>
            <ApolloProvider>
                <Provider store={store}>
                    <MenuProvider>
                        <NavigationContainer>
                            <Stack.Navigator>
                                {/* 테스트 용으로 막아둠 */}

                                <Stack.Screen
                                    name={NavigationTitle.login}
                                    component={LoginScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.signup}
                                    component={SignUpScreen}
                                    options={({ route }) => ({
                                        headerTitle: "회원가입",
                                        headerBackTitleVisible: false,
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.findID}
                                    component={FindIDScreen}
                                    options={({ route }) => ({
                                        headerTitle: "아이디 찾기",
                                        headerBackTitleVisible: false,
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.foundID}
                                    component={FoundIDScreen}
                                    options={({ route }) => ({
                                        headerTitle: "아이디 찾기",
                                        headerBackTitleVisible: false,
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.findPassword}
                                    component={FindPasswordScreen}
                                    options={({ route }) => ({
                                        headerTitle: "비밀번호 찾기",
                                        headerBackTitleVisible: false,
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.settingPassword}
                                    // name="비밀번호 재설정"
                                    component={PasswordSettingScreen}
                                    // options={}
                                    options={({ route }) => ({
                                        headerTitle: "비밀번호 재설정",
                                        headerBackTitleVisible: false,
                                    })}
                                />
                                {/* 새 비밀번호 등록 */}
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
                                    // options={{
                                    //     // headerBackTitleVisible: false,
                                    //     // headerback
                                    //     // headerLeft: null,
                                    //     // TODO: 개발 끝나면 false 로 처리하기.
                                    //     // headerShown: false,
                                    //     // headerStyle: {
                                    //     //     backgroundColor: colors.background,
                                    //     // },
                                    // }}
                                    options={({ route }) => ({
                                        headerTitle: "",
                                        headerBackTitleVisible: false,
                                        // headerLeft: null,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />
                                <Stack.Screen
                                    name={NavigationTitle.posting}
                                    component={PostingScreen}
                                    options={({ route }) => ({
                                        headerTitle: "설문 작성",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                        headerRight: () => (
                                            <ImageButton
                                                img={require("./assets/selectedSingleSelection.png")}
                                            />
                                        ),
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.editSection}
                                    component={EditingSectionScreen}
                                    options={({ route }) => ({
                                        headerTitle: "수정",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                        headerRight: () => (
                                            <FontAwesome5
                                                name="check"
                                                size={24}
                                                color="black"
                                            />
                                        ),
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.participatedSurveys}
                                    component={ParticipatedSurveysScreen}
                                    options={({ route }) => ({
                                        headerTitle: "참여한 설문",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.postedSurveys}
                                    component={PostedSurveysScreen}
                                    options={({ route }) => ({
                                        headerTitle: "요청한 설문",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                    // options={{
                                    //     headerBackTitleVisible: false,
                                    //     headerStyle: {
                                    //         backgroundColor: colors.background,
                                    //     },
                                    // }}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.setting}
                                    component={SettingScreen}
                                    // options={{
                                    //     headerBackTitleVisible: false,
                                    //     headerStyle: {
                                    //         backgroundColor: colors.background,
                                    //     },
                                    // }}
                                    options={({ route }) => ({
                                        headerBackTitleVisible: false,
                                        headerTitle: "설정",
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.myinfo}
                                    component={MyInfoScreen}
                                    options={({ route }) => ({
                                        headerTitle: "내 정보",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.myGenre}
                                    component={MyGenreScreen}
                                    options={({ route }) => ({
                                        headerTitle: "내 관심사",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.pointHistory}
                                    component={PointHistoryScreen}
                                    options={({ route }) => ({
                                        headerTitle: "포인트 내역",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
                                />

                                <Stack.Screen
                                    name={NavigationTitle.targetting}
                                    component={TargettingScreen}
                                    options={({ route }) => ({
                                        headerTitle: "참여자 조건 설정",
                                        headerBackTitleVisible: false,
                                        headerStyle: {
                                            backgroundColor: colors.background,
                                        },
                                    })}
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
                        <Toast config={toastConfig} />
                        <LoadingIndicator />
                    </MenuProvider>
                </Provider>
            </ApolloProvider>
        </CustomProvider>
    );
};

export default App;

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
