import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../utils/NavHelper";
// import { NavigationTitle } from "../utils/NavigationTitle";
import { NavigationTitle } from "../../utils/NavHelper";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { colors } from "../../utils/colors";
import TextButton from "../../components/TextButton";
import { screenWidth } from "../../utils/ScreenSize";
import Spacer from "../../components/common/Spacer";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "../../utils/sizes";
import { login } from "../../API/UserAPI";
import { UserState } from "../../interfaces/UserState";
import { saveUserState } from "../../utils/Storage";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import showMessageAlert from "../../components/CustomAlert";
import { log, logObject } from "../../utils/Log";
import { API_BASE_URL } from "../../API/API";
// import { Apollocient}
import {
    // gql,
    useQuery,
    ApolloProvider,
    InMemoryCache,
    ApolloClient,
} from "@apollo/client";
import { GraphQLClient, gql } from "graphql-request";
import { useCustomContext } from "../../features/context/CustomContext";

export default function LoginScreen({
    navigation,
}: {
    navigation: StackNavigationProp<RootStackParamList, NavigationTitle.login>;
}) {
    const { updateLoadingStatus } = useCustomContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const passwordRef = useRef(null);

    const handleKeyPress = ref => {
        // if (event.key === 'Enter') {
        ref.current.focus();
        // }
    };

    useEffect(() => {
        setUsername("");
        setPassword("");
    }, []);

    const handleDismissKeyboard = () => {
        console.log("dismiss keyboard called");
        Keyboard.dismiss();
    };

    const loginAction = async (username: string, password: string) => {
        console.log(
            `[LoginScreen] username: ${username}, password: ${password}`
        );

        if (username === "") {
            showMessageAlert("아이디 미입력", "아이디를 입력해주세요.");
            return;
        }
        if (password === "") {
            showMessageAlert("비밀번호 미입력", "비밀번호를 입력해주세요");
            return;
        }

        try {
            updateLoadingStatus(true);
            const userResponse = await login(username, password);
            const { userId, accessToken, refreshToken } = userResponse.data;
            const userState: UserState = { userId, accessToken, refreshToken };
            await saveUserState(userState);

            navigation.navigate(NavigationTitle.mainTabs, undefined);
        } catch (error) {
            showMessageAlert(
                "잘못된 로그인 정보입니다",
                "아이디 또는 비밀번호를 다시 확인해주세요."
            );
            console.error("[LoginScreen], login error:", error);
        } finally {
            updateLoadingStatus(false);
        }
    };

    return (
        // <View style={styles.mainContainer}>
        <SafeAreaView style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <View style={[styles.mainContainer]}>
                    <Spacer size={40} />
                    {/* <View>
                        <Image source={require("../assets/coin.jpg")} />
                    </View> */}

                    <View>
                        <View style={styles.loginInfoContainer}>
                            <TextInput
                                placeholder="아이디 입력"
                                style={styles.textInputStyle}
                                value={username}
                                onChangeText={setUsername}
                                keyboardType="email-address"
                                onSubmitEditing={() => {
                                    console.log("[LoginScreen] return tapped");
                                    handleKeyPress(passwordRef);
                                }}
                            />
                        </View>
                        <View style={{ height: 4 }} />
                        <View style={styles.loginInfoContainer}>
                            <TextInput
                                ref={passwordRef}
                                placeholder="비밀번호 입력"
                                style={styles.textInputStyle}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                onSubmitEditing={() => {
                                    console.log(
                                        "[LoginScreen] return tapped from password textinput"
                                    );
                                    loginAction(username, password);
                                }}
                            />
                        </View>
                        <View style={{ height: 30 }} />

                        <TextButton
                            title="로그인"
                            onPress={() => {
                                console.log("login tapped");
                                // 성공시 여기 화면으로 넘어가기!
                                loginAction(username, password);
                            }}
                            textStyle={styles.loginTextStyle}
                            backgroundStyle={[
                                styles.loginInfoContainer,
                                styles.bottomButtonContainer,
                                styles.loginBackgroundStyle,
                                { marginBottom: 10, marginTop: 30 },
                            ]}
                        />
                        <Spacer size={10} />
                        <TextButton
                            title="회원가입"
                            onPress={() => {
                                console.log("login tapped");
                                // 성공시 여기 화면으로 넘어가기!
                                // loginAction(username, password);
                                navigation.navigate(NavigationTitle.signup);
                            }}
                            textStyle={styles.loginTextStyle}
                            backgroundStyle={[
                                styles.loginInfoContainer,
                                styles.bottomButtonContainer,
                                styles.loginBackgroundStyle,
                            ]}
                        />
                        {/* </View> */}

                        <Spacer size={20} />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <TextButton
                                title="아이디 찾기"
                                onPress={() => {
                                    log("forgot ID tapped");
                                    navigation.navigate(NavigationTitle.findID);
                                }}
                                textStyle={{
                                    color: colors.deepMainColor,
                                    fontWeight: "bold",
                                }}
                                backgroundStyle={{ alignItems: "center" }}
                                hasShadow={false}
                            />

                            <TextButton
                                title="비밀번호 찾기"
                                onPress={() => {
                                    log("forgot Password tapped");
                                    navigation.navigate(
                                        NavigationTitle.findPassword
                                    );
                                }}
                                textStyle={{
                                    color: colors.deepMainColor,
                                    fontWeight: "bold",
                                }}
                                hasShadow={false}
                                backgroundStyle={{ alignItems: "center" }}
                            />
                        </View>
                    </View>
                    <View></View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "space-between",
        flexGrow: 1,
        alignItems: "center",
    },
    loginInfoContainer: {
        borderRadius: 10,
        borderColor: colors.gray3,
        borderWidth: 2,
        height: 45,
        flexDirection: "row",
        marginHorizontal: 20,
    },
    bottomButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: screenWidth - 40,
        marginLeft: 20,
        alignSelf: "center",
        backgroundColor: colors.deepMainColor,
        borderWidth: 0,
    },
    loginTextStyle: { fontSize: 20, justifyContent: "center", color: "white" },
    loginBackgroundStyle: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    textInputStyle: {
        flexGrow: 1,
        paddingHorizontal: 20,
        fontSize: fontSizes.s16,
    },
});
